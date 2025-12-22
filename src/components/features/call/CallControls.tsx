"use client";

import { HiMicrophone, HiPhone } from "react-icons/hi";

type CallControlsProps = {
  isMuted: boolean;
  onToggleMute: () => void;
  onEndCall: () => void;
};

export function CallControls({
  isMuted,
  onToggleMute,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Mute Button */}
      <button
        type="button"
        onClick={onToggleMute}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
          isMuted
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        title={isMuted ? "ミュート解除" : "ミュート"}
      >
        <HiMicrophone className="w-6 h-6" />
        {isMuted && (
          <div className="absolute w-8 h-0.5 bg-red-500 rotate-45" />
        )}
      </button>

      {/* End Call Button */}
      <button
        type="button"
        onClick={onEndCall}
        className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
        title="通話終了"
      >
        <HiPhone className="w-6 h-6 rotate-135" />
      </button>
    </div>
  );
}
