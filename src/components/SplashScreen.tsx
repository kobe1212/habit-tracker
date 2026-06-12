import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MIN_VISIBLE_MS = 2200; // ensure the splash is actually seen, not a flash
const HARD_CAP_MS = 6000; // dismiss even if the video never fires `ended`

/**
 * Plays the launch splash video over the phone frame, then fades out and
 * calls onDone. Stays up for at least MIN_VISIBLE_MS, dismisses when the
 * video ends (or on error / hard cap), and is skippable with a tap.
 */
export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const startRef = useRef(Date.now());

  const dismiss = useCallback(() => {
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startRef.current));
    setTimeout(() => setVisible(false), wait);
  }, []);

  useEffect(() => {
    const cap = setTimeout(() => setVisible(false), HARD_CAP_MS);
    return () => clearTimeout(cap);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          className="absolute inset-0 z-50 bg-ink flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          onClick={() => setVisible(false)}
        >
          <video
            src="/media/splash.mp4"
            autoPlay
            muted
            playsInline
            onEnded={dismiss}
            onError={dismiss}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
