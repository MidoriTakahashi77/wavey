"use client";

import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="h-14 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">👋</span>
        <span className="font-bold text-gray-900">Wavey</span>
      </div>
      <UserMenu />
    </header>
  );
}
