import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller";

const router: Router = Router();

router.route("/register").post(registerUser as any);
router.route("/login").post(loginUser as any);
router.route("/logout").post(logoutUser as any);

export default router;
