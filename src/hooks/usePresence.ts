"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type PresenceUser = {
  userId: string;
  userName: string;
  status: "online" | "busy";
  joinedAt: string;
};

type PresenceState = {
  [key: string]: PresenceUser[];
};

type UsePresenceOptions = {
  workspaceId: string | null;
  currentUserId: string | null;
  currentUserName: string | null;
};

export function usePresence(options: UsePresenceOptions) {
  const { workspaceId, currentUserId, currentUserName } = options;
  const [onlineMembers, setOnlineMembers] = useState<PresenceUser[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Subscribe to presence
  useEffect(() => {
    if (!workspaceId || !currentUserId || !currentUserName) return;

    const presenceChannel = supabase.channel(`presence:${workspaceId}`, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState<PresenceUser>();
        const members = extractMembers(state);
        setOnlineMembers(members);
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        console.log("User joined:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        console.log("User left:", leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            userId: currentUserId,
            userName: currentUserName,
            status: "online",
            joinedAt: new Date().toISOString(),
          });
        }
      });

    channelRef.current = presenceChannel;

    return () => {
      presenceChannel.untrack();
      supabase.removeChannel(presenceChannel);
    };
  }, [workspaceId, currentUserId, currentUserName]);

  // Update status (online/busy)
  const updateStatus = useCallback(
    async (status: "online" | "busy") => {
      if (!channelRef.current || !currentUserId || !currentUserName) return;

      await channelRef.current.track({
        userId: currentUserId,
        userName: currentUserName,
        status,
        joinedAt: new Date().toISOString(),
      });
    },
    [currentUserId, currentUserName]
  );

  return {
    onlineMembers,
    updateStatus,
  };
}

function extractMembers(state: PresenceState): PresenceUser[] {
  const members: PresenceUser[] = [];

  for (const presences of Object.values(state)) {
    if (presences.length > 0) {
      members.push(presences[0]);
    }
  }

  return members;
}
