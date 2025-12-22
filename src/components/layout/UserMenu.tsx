"use client";

import { Menu } from "@base-ui/react/menu";
import { Avatar } from "@/components/ui";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

export function UserMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
        <Avatar size="sm" status="online" />
        <span className="text-sm text-gray-700 hidden sm:inline">ゲスト</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="bg-white border border-gray-200 rounded-md shadow-lg py-1 min-w-40 z-50">
            <Menu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => console.log("Profile clicked")}
            >
              <HiOutlineUser className="w-4 h-4" />
              プロフィール
            </Menu.Item>
            <Menu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => console.log("Settings clicked")}
            >
              <HiOutlineCog className="w-4 h-4" />
              設定
            </Menu.Item>
            <Menu.Separator className="my-1 border-t border-gray-200" />
            <Menu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={() => console.log("Logout clicked")}
            >
              <HiOutlineLogout className="w-4 h-4" />
              ログアウト
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
