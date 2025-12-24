import type { UserRecord, CreateUserData, UpdateUserData, DbClient } from "../../db/types";

export interface UserRepository {
  findById(id: string, tx?: DbClient): Promise<UserRecord | null>;
  findByEmail(email: string, tx?: DbClient): Promise<UserRecord | null>;
  create(data: CreateUserData, tx?: DbClient): Promise<UserRecord>;
  update(id: string, data: UpdateUserData, tx?: DbClient): Promise<UserRecord>;
}
