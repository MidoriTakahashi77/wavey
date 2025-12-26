import type { UserRecord, CreateUserData, UpdateUserData, DbClient } from "../../../db/types";

export interface UserRepository {
  findUserById(id: string, tx?: DbClient): Promise<UserRecord | null>;
  findUserByEmail(email: string, tx?: DbClient): Promise<UserRecord | null>;
  createUser(data: CreateUserData, tx?: DbClient): Promise<UserRecord>;
  updateUser(id: string, data: UpdateUserData, tx?: DbClient): Promise<UserRecord>;
}
