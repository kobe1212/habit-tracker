import type { ReactNode } from "react";

/**
 * Centers the mobile-first UI in a phone-shaped frame on larger screens,
 * and fills the viewport on actual mobile devices.
 */
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] flex items-center justify-center sm:py-8">
      <div className="relative w-full sm:w-[400px] h-screen sm:h-[840px] bg-ink sm:rounded-[44px] sm:border sm:border-white/10 sm:shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}
