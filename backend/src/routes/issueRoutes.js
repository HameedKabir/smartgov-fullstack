import { Router } from "express";

import {
  addIssueUpdate,
  createIssue,
  getIssueById,
  getIssues,
  updateIssue,
  updateIssueStatus,
} from "../controllers/issueController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import {
  addIssueUpdateValidator,
  createIssueValidator,
  issueIdValidator,
  issueQueryValidator,
  updateIssueValidator,
  updateStatusValidator,
} from "../validators/issueValidators.js";

const router = Router();

router.use(authenticate);

router.get("/", issueQueryValidator, validate, getIssues);
router.post("/", upload.single("image"), createIssueValidator, validate, createIssue);
router.get("/:issueId", issueIdValidator, validate, getIssueById);
router.patch("/:issueId", issueIdValidator, updateIssueValidator, validate, updateIssue);
router.put("/:issueId", issueIdValidator, updateIssueValidator, validate, updateIssue);
router.patch(
  "/:issueId/status",
  issueIdValidator,
  authorize("admin"),
  updateStatusValidator,
  validate,
  updateIssueStatus,
);
router.post(
  "/:issueId/updates",
  issueIdValidator,
  addIssueUpdateValidator,
  validate,
  addIssueUpdate,
);

export default router;
