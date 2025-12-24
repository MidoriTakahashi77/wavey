import { pgTable, uuid, text, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").unique().notNull(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  ownedWorkspaces: many(workspaces),
  workspaceUsers: many(workspaceUsers),
  sentWaves: many(waves, { relationName: "sentWaves" }),
  receivedWaves: many(waves, { relationName: "receivedWaves" }),
}));

// Workspaces
export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  members: many(workspaceUsers),
  invites: many(workspaceInvites),
  waves: many(waves),
}));

// WorkspaceUsers (junction table)
export const workspaceUsers = pgTable(
  "workspace_users",
  {
    workspaceId: uuid("workspace_id")
      .references(() => workspaces.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role", { enum: ["owner", "member"] }).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.workspaceId, table.userId] })]
);

export const workspaceUsersRelations = relations(workspaceUsers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceUsers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceUsers.userId],
    references: [users.id],
  }),
}));

// WorkspaceInvites
export const workspaceInvites = pgTable("workspace_invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  code: text("code").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workspaceInvitesRelations = relations(workspaceInvites, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceInvites.workspaceId],
    references: [workspaces.id],
  }),
}));

// Waves
export const waves = pgTable("waves", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  fromUserId: uuid("from_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  toUserId: uuid("to_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status", {
    enum: ["pending", "accepted", "declined", "expired"],
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
});

export const wavesRelations = relations(waves, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [waves.workspaceId],
    references: [workspaces.id],
  }),
  fromUser: one(users, {
    fields: [waves.fromUserId],
    references: [users.id],
    relationName: "sentWaves",
  }),
  toUser: one(users, {
    fields: [waves.toUserId],
    references: [users.id],
    relationName: "receivedWaves",
  }),
}));
