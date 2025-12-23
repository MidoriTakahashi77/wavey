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
      <label className="block text-sm font-medium text-gray-700">
        スキンを選択
      </label>
      <div className="grid grid-cols-3 gap-3">
        {SKINS.map((skin) => {
          const isSelected = value === skin.id;
          return (
            <button
              key={skin.id}
              type="button"
              data-testid="skin-option"
              onClick={() => onChange(skin.id)}
              className={`
                relative p-2 rounded-lg border-2 transition-all
                ${isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
                }
              `}
            >
              <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                <Image
                  src={skin.src}
                  alt={skin.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <p className="text-xs text-gray-600 text-center truncate">
                {skin.name}
              </p>
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <HiCheck className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">
        マイクラスキン形式（64x64 PNG）をサポートしています
      </p>
    </div>
  );
}
