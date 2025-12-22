"use client";

import { ReactNode } from "react";

type RoomColor = "blue" | "green" | "yellow" | "pink" | "purple";

type RoomProps = {
  name: string;
  color: RoomColor;
  children: ReactNode;
  className?: string;
};

const colorStyles: Record<RoomColor, string> = {
  blue: "bg-blue-200 border-blue-300",
  green: "bg-green-200 border-green-300",
  yellow: "bg-yellow-200 border-yellow-300",
  pink: "bg-pink-200 border-pink-300",
  purple: "bg-purple-200 border-purple-300",
};

export function Room({ name, color, children, className = "" }: RoomProps) {
  return (
    <div
      className={`relative rounded-lg border-2 p-4 ${colorStyles[color]} ${className}`}
    >
      <div className="absolute -top-3 left-3 bg-white px-2 py-0.5 rounded text-xs font-medium text-gray-600 border">
        {name}
      </div>
      <div className="flex flex-wrap gap-3 justify-center items-end min-h-[120px] pt-2">
        {children}
      </div>
    </div>
  );
}
