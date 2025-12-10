import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import config from "../../config";
import ApiError from "../../errors/ApiErrors";
import { IErrorResponse } from "../../interfaces/common";

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let errorMessages: Array<{ path: string; message: string }> = [];

  // Zod validation error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    errorMessages = err.issues.map((error: any) => ({
      path: error.path.join(".") || "unknown",
      message: error.message,
    }));
  }
  // ApiError (custom)
  else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Prisma validation error
  else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Validation error";
  }
  // Prisma unique constraint error
  else if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 400;
      message = "Duplicate entry. This record already exists.";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found.";
    }
  }
  // JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Log error in development
  if (config.nodeEnv === "development") {
    console.error("Error:", {
      statusCode,
      message,
      errorMessages,
      stack: err.stack,
    });
  }

  // Send response
  const response: IErrorResponse = {
    success: false,
    message,
    ...(errorMessages.length > 0 && { errorMessages }),
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
