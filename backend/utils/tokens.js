import jwt from "jsonwebtoken";
import crypto from "crypto";

export const createAccessToken = (user) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  return jwt.sign({ sub: user.id.toString(), role: user.role }, secret, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
