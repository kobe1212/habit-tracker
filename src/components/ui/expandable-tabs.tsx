"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface Tab {
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  /** Controlled selected index. When provided, the component reflects this value
   *  (and stays put instead of collapsing on outside click) — used for nav. */
  selected?: number | null;
  /** Initial selected index for uncontrolled usage. */
  defaultSelected?: number | null;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition: Transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-brand",
  selected: controlledSelected,
  defaultSelected = null,
  onChange,
}: ExpandableTabsProps) {
  const isControlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = React.useState<number | null>(defaultSelected);
  const selected = isControlled ? controlledSelected : internalSelected;
  const outsideClickRef = React.useRef<HTMLDivElement>(null);

  // usehooks-ts types expect a non-null ref; React 19 refs are RefObject<T | null>.
  useOnClickOutside(outsideClickRef as React.RefObject<HTMLElement>, () => {
    if (isControlled) return; // controlled nav stays in sync with its source
    setInternalSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    if (!isControlled) setInternalSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-line" aria-hidden="true" />
  );

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface p-1 shadow-sm",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
              selected === index
                ? cn("bg-surface-2", activeColor)
                : "text-muted hover:bg-surface-2 hover:text-fg"
            )}
          >
            <Icon size={20} />
            <AnimatePresence initial={false}>
              {selected === index && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
