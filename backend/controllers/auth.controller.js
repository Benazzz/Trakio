import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../validators/auth.schema.js";
import * as authService from "../services/auth.service.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
} from "../utils/tokens.js";

export const register = async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });

  const { email, username, password } = result.data;
  const exists = await authService.getUserByEmailOrUsername(email, username);
  if (exists)
    return res
      .status(409)
      .json({ error: "Email or username is already taken" });

  const hash = await bcrypt.hash(password, 10);

  const createdUser = await authService.createUser(email, username, hash);
  res.status(201).json(createdUser);
};

export const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });

  const { email, password } = result.data;

  const user = await authService.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ error: "Invalid email or password" });
  if (user.is_blocked)
    return res.status(403).json({ error: "User is blocked" });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken();
  await authService.saveRefreshToken(user.id, hashToken(refreshToken));

  res.status(200).json({ accessToken, refreshToken });
};

export const refresh = async (req, res) => {
  const result = refreshSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });

  const stored = await authService.findValidRefreshToken(
    hashToken(result.data.refreshToken),
  );
  if (!stored || stored.deleted_at)
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  if (stored.is_blocked)
    return res.status(403).json({ error: "User is blocked" });

  await authService.cancelRefreshToken(stored.token_id);

  const accessToken = createAccessToken({
    id: stored.user_id,
    role: stored.role,
  });
  const refreshToken = createRefreshToken();
  await authService.saveRefreshToken(stored.user_id, hashToken(refreshToken));

  res.status(200).json({ accessToken, refreshToken });
};

export const logout = async (req, res) => {
  const result = refreshSchema.safeParse(req.body);
  if (!result.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: result.error.issues });

  const stored = await authService.findValidRefreshToken(
    hashToken(result.data.refreshToken),
  );
  if (!stored)
    return res.status(401).json({ error: "Invalid or expired refresh token" });

    await authService.cancelRefreshToken(stored.token_id);

    return res.status(204).end();
};
