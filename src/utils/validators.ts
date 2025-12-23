import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema, source: "body" | "query" = "body") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = source === "query" ? req.query : req.body;
      const parsed = schema.parse(data);
      
      // Replace the source with parsed data
      if (source === "query") {
        req.query = parsed as any;
      } else {
        req.body = parsed;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation Error",
          errors: error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }
      res.status(500).json({ message: "Server Error" });
    }
  };
};
