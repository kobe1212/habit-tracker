import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../store/ProfileStore";
import Avatar from "../components/Avatar";

const PRESET_AVATARS = ["🙂", "😎", "🦊", "🐱", "🐼", "🦁", "🚀", "🌟", "🔥", "🧘", "🏃", "💪"];

/** Read an image file and downscale it to keep localStorage small. */
function resizeImage(file: File, max = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name === "Your Name" ? "" : profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file);
      setAvatar(dataUrl);
    } catch {
      alert("Could not load that image. Please try another.");
    }
  };

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    updateProfile({ name: name.trim(), avatar });
    navigate("/profile");
  };

  return (
    <div className="flex flex-col h-full text-fg">
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-28">
        {/* Header */}
        <header className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Edit Profile</h1>
          <span className="w-9" />
        </header>

        {/* Avatar with upload button */}
        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <Avatar avatar={avatar} size={104} />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-brand flex items-center justify-center border-4 border-ink"
              aria-label="Upload photo"
            >
              <CameraIcon />
            </button>
          </div>
          <button onClick={() => fileRef.current?.click()} className="mt-3 text-sm text-brand font-medium">
            Upload a photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Preset avatars */}
        <div className="mt-6">
          <span className="text-sm font-semibold">Or pick an avatar</span>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {PRESET_AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={`aspect-square rounded-2xl text-xl flex items-center justify-center ${avatar === a ? "bg-brand" : "bg-surface"
                  }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <label className="block mt-6">
          <span className="text-sm font-semibold">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Amirul Haziq"
            maxLength={40}
            className="mt-2 w-full bg-surface rounded-2xl px-4 py-3.5 text-fg placeholder:text-muted outline-none focus:ring-2 focus:ring-brand"
          />
        </label>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="mt-8 w-full bg-brand text-white font-semibold py-4 rounded-2xl disabled:opacity-40"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.2" stroke="white" strokeWidth="1.8" />
    </svg>
  );
}
