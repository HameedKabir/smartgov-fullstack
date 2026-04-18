import { body, param, query } from "express-validator";

const statuses = ["Pending", "In Review", "Resolved", "Rejected"];
const priorities = ["Low", "Medium", "High", "Critical"];

export const createIssueValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category").optional({ values: "falsy" }).isString(),
  body("priority")
    .optional({ values: "falsy" })
    .isIn(priorities)
    .withMessage(`Priority must be one of: ${priorities.join(", ")}`),
  body("lat").isFloat().withMessage("Latitude must be a valid number"),
  body("lng").isFloat().withMessage("Longitude must be a valid number"),
  body("address").optional({ values: "falsy" }).isString(),
  body("city").optional({ values: "falsy" }).isString(),
];

export const issueQueryValidator = [
  query("status").optional().isIn(statuses).withMessage("Invalid status filter"),
  query("category").optional().isString(),
  query("search").optional().isString(),
  query("includeMeta").optional().isIn(["true", "false"]),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];

export const issueIdValidator = [
  param("issueId").isMongoId().withMessage("A valid issue ID is required"),
];

export const updateIssueValidator = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Description cannot be empty"),
  body("category").optional().isString(),
  body("priority")
    .optional()
    .isIn(priorities)
    .withMessage(`Priority must be one of: ${priorities.join(", ")}`),
  body("status")
    .optional()
    .isIn(statuses)
    .withMessage(`Status must be one of: ${statuses.join(", ")}`),
  body("assignedTo").optional({ nullable: true }).isMongoId().withMessage("assignedTo must be a valid user ID"),
];

export const updateStatusValidator = [
  body("status")
    .isIn(statuses)
    .withMessage(`Status must be one of: ${statuses.join(", ")}`),
];

export const addIssueUpdateValidator = [
  body("message").trim().notEmpty().withMessage("Update message is required"),
  body("status")
    .optional({ values: "falsy" })
    .isIn(statuses)
    .withMessage(`Status must be one of: ${statuses.join(", ")}`),
  body("visibility")
    .optional({ values: "falsy" })
    .isIn(["public", "internal"])
    .withMessage("Visibility must be public or internal"),
];
