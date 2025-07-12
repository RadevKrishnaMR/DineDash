import { Router } from "express";
import { register, login, logout, refreshToken } from "../../controllers/auth.controller";
import { authPath } from "../route.dir";

export const authRouter = Router();

authRouter.post(authPath.REGISTER, register);
authRouter.post(authPath.LOGIN, login);
authRouter.post(authPath.LOGOUT, logout);
authRouter.post(authPath.REFRESHTOKEN, refreshToken);