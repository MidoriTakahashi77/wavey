import { z } from "@hono/zod-openapi";
import { LIMITS } from "../lib/constants";

// User entity
export const UserSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    displayName: z.string().min(1).max(LIMITS.DISPLAY_NAME_MAX_LENGTH),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .openapi("User");

export type User = z.infer<typeof UserSchema>;

// Profile response (self)
export const ProfileSchema = UserSchema.openapi("Profile");

export type Profile = z.infer<typeof ProfileSchema>;

// Update profile request
export const UpdateProfileRequestSchema = z
  .object({
    displayName: z.string().min(1).max(LIMITS.DISPLAY_NAME_MAX_LENGTH),
  })
  .openapi("UpdateProfileRequest");

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;

// User summary (for member lists)
export const UserSummarySchema = z
  .object({
    id: z.string().uuid(),
    displayName: z.string(),
  })
  .openapi("UserSummary");

export type UserSummary = z.infer<typeof UserSummarySchema>;
