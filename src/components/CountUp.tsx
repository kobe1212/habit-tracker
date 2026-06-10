import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface CountUpProps {
  value: number;
  suffix?: string;
  className?: string;
}

/** Number that counts up from its previous value whenever `value` changes. */
export default function CountUp({ value, suffix = "", className }: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const controls = animate(current.current, value, {
      duration: 0.7,
      ease: "easeOut",
      onUpdate: (v) => {
        current.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className={className}>
      {Math.round(display)}
      {suffix}
    </span>
  );
}
