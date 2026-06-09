import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface Profile {
  name: string;
  /** Either an emoji (e.g. "🙂") or an image data URL ("data:image/...") */
  avatar: string;
  notifications: boolean;
}

const DEFAULT: Profile = { name: "Your Name", avatar: "🙂", notifications: false };
const STORAGE_KEY = "habit-tracker-profile";

interface ProfileValue {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
}

const ProfileContext = createContext<ProfileValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT, ...JSON.parse(saved) };
      } catch {
        return DEFAULT;
      }
    }
    return DEFAULT;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<Profile>) =>
    setProfile((prev) => ({ ...prev, ...updates }));

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
}

/** True when the avatar is an uploaded image rather than an emoji. */
export function isImageAvatar(avatar: string): boolean {
  return avatar.startsWith("data:") || avatar.startsWith("http");
}
