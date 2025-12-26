"use client";

import Image from "next/image";
import { HiCheck } from "react-icons/hi";

const SKINS = [
  { id: "skin1", name: "ブルー", src: "/skins/skin1.png" },
  { id: "skin2", name: "グリーン", src: "/skins/skin2.png" },
  { id: "skin3", name: "オレンジ", src: "/skins/skin3.png" },
];

type SkinSelectorProps = {
  value: string;
  onChange: (skinId: string) => void;
};

export function SkinSelector({ value, onChange }: SkinSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">スキンを選択</label>
      <div className="grid grid-cols-3 gap-3">
        {SKINS.map((skin) => {
          const isSelected = value === skin.id;
          return (
            <button
              key={skin.id}
              type="button"
              data-testid="skin-option"
              onClick={() => onChange(skin.id)}
              className={`relative rounded-lg border-2 p-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              } `}
            >
              <div className="mb-2 aspect-square overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={skin.src}
                  alt={skin.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <p className="truncate text-center text-xs text-gray-600">{skin.name}</p>
              {isSelected && (
                <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                  <HiCheck className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">マイクラスキン形式（64x64 PNG）をサポートしています</p>
    </div>
  );
}
