import { validationResult } from "express-validator";

import { ApiError } from "../utils/ApiError.js";

export const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new ApiError(400, errors.array().map((error) => error.msg).join(", ")));
  }

  next();
};
