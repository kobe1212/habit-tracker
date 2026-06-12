import { useEffect } from "react";
import { useLottie } from "lottie-react";
import { motion } from "framer-motion";
import fireAnim from "../assets/lottie/fire.json";
import confettiAnim from "../assets/lottie/confetti.json";

function playSound(src: string) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.7;
    void audio.play().catch(() => {});
  } catch {
    /* audio is best-effort */
  }
}

/** Renders a one-shot Lottie animation via the hook API (avoids the
 *  default-export interop issue with the <Lottie> component under Vite). */
function LottieBox({ data, className }: { data: unknown; className?: string }) {
  const { View } = useLottie({
    animationData: data,
    loop: false,
    autoplay: true,
  });
  return <div className={className}>{View}</div>;
}

/** Duolingo-style flame burst shown when a completion extends a streak. */
export function FireStreakPopup({ streak, onDone }: { streak: number; onDone: () => void }) {
  useEffect(() => {
    playSound("/media/streak.mp3");
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-ink/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0.6, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
      >
        <LottieBox data={fireAnim} className="h-44 w-44" />
        <p className="mt-2 text-3xl font-extrabold text-fg">{streak} day streak!</p>
        <p className="mt-1 text-sm text-muted">Keep the fire going</p>
      </motion.div>
    </motion.div>
  );
}

/** Full-screen confetti shown when every habit for the day is complete. */
export function ConfettiPopup({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    playSound("/media/confetti.mp3");
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-ink/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onDone}
    >
      <LottieBox data={confettiAnim} className="pointer-events-none absolute inset-0 h-full w-full" />
      <motion.div
        className="relative flex flex-col items-center text-center px-8"
        initial={{ scale: 0.6, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
      >
        <span className="text-5xl">🎉</span>
        <p className="mt-3 text-2xl font-extrabold text-fg">All habits done!</p>
        <p className="mt-1 text-sm text-muted">You completed everything today.</p>
        <button onClick={onDone} className="mt-5 bg-brand text-white font-semibold px-6 py-3 rounded-2xl">
          Nice!
        </button>
      </motion.div>
    </motion.div>
  );
}
