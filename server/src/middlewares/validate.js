import { ZodError } from "zod";
import { validationError } from "../utils/errors.js";

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw validationError();
      }
      next(error);
    }
  };
};
