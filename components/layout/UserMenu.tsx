"use client";

import { Menu } from "@base-ui/react/menu";
import { Avatar } from "@/components/ui";
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from "react-icons/hi";

export function UserMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger className="flex cursor-pointer items-center gap-2 rounded-md p-1 transition-colors hover:bg-gray-100">
        <Avatar size="sm" status="online" />
        <span className="hidden text-sm text-gray-700 sm:inline">ゲスト</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8}>
          <Menu.Popup className="z-50 min-w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
            <Menu.Item
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => console.log("Profile clicked")}
            >
              <HiOutlineUser className="h-4 w-4" />
              プロフィール
            </Menu.Item>
            <Menu.Item
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => console.log("Settings clicked")}
            >
              <HiOutlineCog className="h-4 w-4" />
              設定
            </Menu.Item>
            <Menu.Separator className="my-1 border-t border-gray-200" />
            <Menu.Item
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              onClick={() => console.log("Logout clicked")}
            >
              <HiOutlineLogout className="h-4 w-4" />
              ログアウト
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
