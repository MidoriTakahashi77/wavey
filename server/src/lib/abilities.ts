import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
  type InferSubjects,
} from "@casl/ability";

// Define action types
type Actions = "manage" | "create" | "read" | "update" | "delete";

// Define subject types with their corresponding data structures
type Subjects =
  | InferSubjects<
      typeof WorkspaceSubject | typeof MemberSubject | typeof InviteSubject | typeof WaveSubject
    >
  | "all";

// Subject classes for CASL
class WorkspaceSubject {
  readonly kind = "Workspace" as const;
  constructor(
    public id: string,
    public ownerId: string
  ) {}
}

class MemberSubject {
  readonly kind = "Member" as const;
  constructor(
    public workspaceId: string,
    public userId: string
  ) {}
}

class InviteSubject {
  readonly kind = "Invite" as const;
  constructor(public workspaceId: string) {}
}

class WaveSubject {
  readonly kind = "Wave" as const;
  constructor(
    public fromUserId: string,
    public toUserId: string
  ) {}
}

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export type UserContext = {
  id: string;
};

export type WorkspaceContext = {
  id: string;
  ownerId: string;
  isMember: boolean;
};

export function defineAbilitiesFor(user: UserContext, workspace?: WorkspaceContext): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  // Workspace abilities
  if (workspace) {
    const isOwner = workspace.ownerId === user.id;

    if (isOwner) {
      can("manage", WorkspaceSubject);
      can("manage", InviteSubject);
      can("manage", MemberSubject);
    } else if (workspace.isMember) {
      can("read", WorkspaceSubject);
      can("read", MemberSubject);
      // Members can remove themselves
      can("delete", MemberSubject, { userId: user.id });
    }

    // Wave abilities for members
    if (workspace.isMember || isOwner) {
      can("create", WaveSubject);
      can("read", WaveSubject, { fromUserId: user.id });
      can("read", WaveSubject, { toUserId: user.id });
      can("update", WaveSubject, { toUserId: user.id }); // Can respond to waves sent to them
    }
  }

  // Anyone can create a workspace
  can("create", WorkspaceSubject);

  return build();
}

// Helper to create subject instances
export const subjects = {
  workspace: (data: { id: string; ownerId: string }) => new WorkspaceSubject(data.id, data.ownerId),
  member: (data: { workspaceId: string; userId: string }) =>
    new MemberSubject(data.workspaceId, data.userId),
  invite: (data: { workspaceId: string }) => new InviteSubject(data.workspaceId),
  wave: (data: { fromUserId: string; toUserId: string }) =>
    new WaveSubject(data.fromUserId, data.toUserId),
};
