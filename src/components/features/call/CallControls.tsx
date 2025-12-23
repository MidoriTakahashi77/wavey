"use client";

import { HiMicrophone, HiPhone } from "react-icons/hi";

type CallControlsProps = {
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
};

export function CallControls({ isMuted, onToggleMute, onEndCall }: CallControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Mute Button */}
      <button
        type="button"
        onClick={onToggleMute}
        className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
          isMuted
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        title={isMuted ? "ミュート解除" : "ミュート"}
      >
        <HiMicrophone className="h-6 w-6" />
        {isMuted && <div className="absolute h-0.5 w-8 rotate-45 bg-red-500" />}
      </button>

      {/* End Call Button */}
      <button
        type="button"
        onClick={onEndCall}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
        title="通話終了"
      >
        <HiPhone className="h-6 w-6 rotate-135" />
      </button>
    </div>
  );
}
