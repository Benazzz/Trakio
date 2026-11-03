import express from "express";
import * as authController from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

export default authRouter;
