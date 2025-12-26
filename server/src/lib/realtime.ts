import { getSupabaseAdmin } from "./supabase";

export type WaveSentEvent = {
  type: "wave:sent";
  payload: {
    waveId: string;
    workspaceId: string;
    fromUserId: string;
    toUserId: string;
  };
};

export type WaveRespondedEvent = {
  type: "wave:responded";
  payload: {
    waveId: string;
    workspaceId: string;
    fromUserId: string;
    toUserId: string;
    status: "accepted" | "declined";
  };
};

export type RealtimeEvent = WaveSentEvent | WaveRespondedEvent;

/**
 * Broadcast an event to all clients in a workspace channel
 */
export async function broadcastToWorkspace(
  workspaceId: string,
  event: RealtimeEvent
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const channel = supabase.channel(`workspace:${workspaceId}`);

  // Must subscribe before sending broadcast messages
  await new Promise<void>((resolve, reject) => {
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        resolve();
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        reject(new Error(`Failed to subscribe to channel: ${status}`));
      }
    });
  });

  const result = await channel.send({
    type: "broadcast",
    event: event.type,
    payload: event.payload,
  });

  console.log(`[Realtime] Broadcast ${event.type} to workspace:${workspaceId}`, result);

  await supabase.removeChannel(channel);
}

/**
 * Broadcast wave sent event
 */
export async function broadcastWaveSent(params: {
  waveId: string;
  workspaceId: string;
  fromUserId: string;
  toUserId: string;
}): Promise<void> {
  await broadcastToWorkspace(params.workspaceId, {
    type: "wave:sent",
    payload: params,
  });
}

/**
 * Broadcast wave responded event
 */
export async function broadcastWaveResponded(params: {
  waveId: string;
  workspaceId: string;
  fromUserId: string;
  toUserId: string;
  status: "accepted" | "declined";
}): Promise<void> {
  await broadcastToWorkspace(params.workspaceId, {
    type: "wave:responded",
    payload: params,
  });
}
