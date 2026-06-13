/** Preset habit categories (fixed set). Stored on a habit by `id`. */
export interface Category {
  id: string;
  name: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: "health", name: "Health", color: "#10b981" },
  { id: "fitness", name: "Fitness", color: "#ef4444" },
  { id: "mind", name: "Mind", color: "#8b5cf6" },
  { id: "work", name: "Work", color: "#3b82f6" },
  { id: "personal", name: "Personal", color: "#f97316" },
];

/** Fallback for habits saved before categories existed (no `category` field). */
export const UNCATEGORIZED: Category = {
  id: "none",
  name: "Uncategorized",
  color: "#8e8e93",
};

/** Resolve a category id to its definition, falling back to Uncategorized. */
export function getCategory(id?: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? UNCATEGORIZED;
}
