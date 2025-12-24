import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import type { UserRepository } from "./user-repository.interface";

export const userRepository: UserRepository = {
  async findById(id) {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return result ?? null;
  },

  async findByEmail(email) {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return result ?? null;
  },

  async create(data) {
    const [user] = await db
      .insert(users)
      .values({
        id: data.id,
        email: data.email,
        displayName: data.displayName,
      })
      .returning();
    return user;
  },

  async update(id, data) {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  },
};
