export const ErrorCode = {
  // Common
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN: "FORBIDDEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // Workspace
  WORKSPACE_LIMIT_EXCEEDED: "WORKSPACE_LIMIT_EXCEEDED",
  MEMBER_LIMIT_EXCEEDED: "MEMBER_LIMIT_EXCEEDED",
  NOT_WORKSPACE_OWNER: "NOT_WORKSPACE_OWNER",
  NOT_WORKSPACE_MEMBER: "NOT_WORKSPACE_MEMBER",

  // Invite
  INVITE_EXPIRED: "INVITE_EXPIRED",
  INVITE_MAX_USES_REACHED: "INVITE_MAX_USES_REACHED",
  ALREADY_MEMBER: "ALREADY_MEMBER",

  // Wave
  CANNOT_WAVE_SELF: "CANNOT_WAVE_SELF",
  WAVE_ALREADY_RESPONDED: "WAVE_ALREADY_RESPONDED",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class AppError extends Error {
  constructor(
    readonly code: ErrorCode,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
