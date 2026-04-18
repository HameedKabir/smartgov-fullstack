import { Router } from "express";

import { login, register } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { loginValidator, registerValidator } from "../validators/authValidators.js";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

export default router;
