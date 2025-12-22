import Image from "next/image";
import { ComponentProps } from "react";

type AvatarSize = "sm" | "md" | "lg";
type AvatarStatus = "online" | "offline" | "busy" | "away";

type AvatarProps = Omit<ComponentProps<"div">, "children"> & {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
};

const sizeStyles: Record<AvatarSize, { container: string; image: number }> = {
  sm: { container: "w-8 h-8", image: 32 },
  md: { container: "w-12 h-12", image: 48 },
  lg: { container: "w-16 h-16", image: 64 },
};

const statusStyles: Record<AvatarStatus, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-yellow-500",
};

const statusBadgeSize: Record<AvatarSize, string> = {
  sm: "w-2.5 h-2.5 border",
  md: "w-3 h-3 border-2",
  lg: "w-4 h-4 border-2",
};

export function Avatar({
  src = "/skins/default.png",
  alt = "Avatar",
  size = "md",
  status,
  className = "",
  ...props
}: AvatarProps) {
  const { container, image } = sizeStyles[size];

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <div
        className={`${container} rounded-md overflow-hidden bg-gray-200 flex items-center justify-center`}
      >
        <Image
          src={src}
          alt={alt}
          width={image}
          height={image}
          className="object-cover pixelated"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${statusBadgeSize[size]} ${statusStyles[status]} rounded-full border-white`}
          aria-label={status}
        />
      )}
    </div>
  );
}
