import { isImageAvatar } from "../store/ProfileStore";

interface AvatarProps {
  avatar: string;
  size?: number;
  className?: string;
}

export default function Avatar({ avatar, size = 56, className = "" }: AvatarProps) {
  const image = isImageAvatar(avatar);
  return (
    <span
      className={`rounded-full overflow-hidden flex items-center justify-center bg-brand/20 shrink-0 ${className}`}
      style={{ height: size, width: size }}
    >
      {image ? (
        <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
      ) : (
        <span style={{ fontSize: size * 0.5, lineHeight: 1 }}>{avatar}</span>
      )}
    </span>
  );
}
