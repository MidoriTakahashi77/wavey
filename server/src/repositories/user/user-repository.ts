import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import type { DbClient } from "../../db/types";
import type { UserRepository } from "./user-repository.interface";

export const userRepository: UserRepository = {
  async findById(id, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.users.findFirst({
      where: eq(users.id, id),
    });
    return result ?? null;
  },

  async findByEmail(email, tx?: DbClient) {
    const client = tx ?? db;
    const result = await client.query.users.findFirst({
      where: eq(users.email, email),
    });
    return result ?? null;
  },

  async create(data, tx?: DbClient) {
    const client = tx ?? db;
    const [user] = await client
      .insert(users)
      .values({
        id: data.id,
        email: data.email,
        displayName: data.displayName,
      })
      .returning();
    return user;
  },

  async update(id, data, tx?: DbClient) {
    const client = tx ?? db;
    const [user] = await client
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
