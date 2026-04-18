import { Router } from "express";

import { getCurrentUser, login, register } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.get("/me", authenticate, getCurrentUser);

export default router;
