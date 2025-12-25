import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { AppError, ErrorCode } from "../lib/errors";

type ErrorResponse = {
  code: string;
  message: string;
};

/**
 * Map error codes to HTTP status codes
 */
function getStatusCode(code: ErrorCode): ContentfulStatusCode {
  switch (code) {
    case ErrorCode.UNAUTHORIZED:
      return 401;
    case ErrorCode.FORBIDDEN:
    case ErrorCode.NOT_WORKSPACE_OWNER:
    case ErrorCode.NOT_WORKSPACE_MEMBER:
      return 403;
    case ErrorCode.NOT_FOUND:
      return 404;
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.CANNOT_WAVE_SELF:
    case ErrorCode.WAVE_ALREADY_RESPONDED:
    case ErrorCode.ALREADY_MEMBER:
    case ErrorCode.INVITE_EXPIRED:
    case ErrorCode.INVITE_MAX_USES_REACHED:
    case ErrorCode.WORKSPACE_LIMIT_EXCEEDED:
    case ErrorCode.MEMBER_LIMIT_EXCEEDED:
      return 400;
    default:
      return 500;
  }
}

/**
 * Global error handler for the API
 * Converts errors to consistent JSON responses
 */
export function errorHandler(err: Error, c: Context): Response {
  console.error("[API Error]", err);

  if (err instanceof AppError) {
    const status = getStatusCode(err.code);
    const body: ErrorResponse = {
      code: err.code,
      message: err.message,
    };
    return c.json(body, status);
  }

  // Zod validation errors from @hono/zod-openapi
  if (err.name === "ZodError" || (err as { status?: number }).status === 400) {
    const body: ErrorResponse = {
      code: ErrorCode.VALIDATION_ERROR,
      message: err.message,
    };
    return c.json(body, 400);
  }

  // Unknown errors
  const body: ErrorResponse = {
    code: "INTERNAL_ERROR",
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  };
  return c.json(body, 500);
}
