import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing or invalid Authorization header" });

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
};

export default authenticate;