import type { Context, Next } from "hono";
import { AppError, ErrorCode } from "../lib/errors";

export type AuthUser = {
  id: string;
  email: string;
};

type Variables = {
  user: AuthUser;
};

/**
 * Authentication middleware
 * Extracts and verifies JWT from Authorization header
 * Sets user in context for downstream handlers
 *
 * Note: Full Supabase Auth integration will be added in Issue #30
 */
export async function authMiddleware(
  c: Context<{ Variables: Variables }>,
  next: Next
): Promise<Response | void> {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Missing or invalid authorization header");
  }

  const token = authHeader.slice(7);

  if (!token) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Missing token");
  }

  // TODO: Verify JWT with Supabase Auth (Issue #30)
  // For now, extract user ID from token (mock implementation)
  const user = await verifyToken(token);

  if (!user) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid token");
  }

  c.set("user", user);
  await next();
}

/**
 * Verify JWT token and extract user info
 * TODO: Replace with Supabase Auth verification in Issue #30
 */
async function verifyToken(token: string): Promise<AuthUser | null> {
  // Mock implementation: expect token format "user_<id>_<email>"
  // This will be replaced with Supabase JWT verification
  if (token.startsWith("user_")) {
    const parts = token.split("_");
    if (parts.length >= 3) {
      return {
        id: parts[1],
        email: parts.slice(2).join("_"),
      };
    }
  }

  return null;
}
