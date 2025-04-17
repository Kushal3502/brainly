import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const router: Router = Router();

router.route("/register").post(registerUser as any);

export default router;
