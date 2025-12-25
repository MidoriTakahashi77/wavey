import type { Context, Next } from "hono";
import { AppError, ErrorCode } from "../lib/errors";
import { getSupabaseAdmin } from "../lib/supabase";
import { userRepository } from "../repositories/user/user-repository";

export type AuthUser = {
  id: string;
  email: string;
};

type Variables = {
  user: AuthUser;
};

/**
 * Authentication middleware
 * Verifies JWT from Authorization header using Supabase Auth
 * Syncs user to database on first login
 * Sets user in context for downstream handlers
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

  // Verify JWT with Supabase Auth
  const {
    data: { user: supabaseUser },
    error,
  } = await getSupabaseAdmin().auth.getUser(token);

  if (error || !supabaseUser) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "Invalid or expired token");
  }

  if (!supabaseUser.email) {
    throw new AppError(ErrorCode.UNAUTHORIZED, "User email is required");
  }

  // Sync user to database on first login
  const user = await syncUser(supabaseUser.id, supabaseUser.email);

  c.set("user", user);
  await next();
}

/**
 * Sync Supabase user to our users table
 * Creates user if not exists, returns existing user otherwise
 */
async function syncUser(id: string, email: string): Promise<AuthUser> {
  const existingUser = await userRepository.findUserById(id);

  if (existingUser) {
    return {
      id: existingUser.id,
      email: existingUser.email,
    };
  }

  // First login - create user in our database
  const newUser = await userRepository.createUser({
    id,
    email,
    displayName: email.split("@")[0], // Default display name from email
  });

  return {
    id: newUser.id,
    email: newUser.email,
  };
}
