export type Theme = "light" | "dark";

export const themeColors = {
  income: {
    light: "#16a34a",
    dark: "#22c55e",
  },
  spending: {
    light: "#dc2626",
    dark: "#ef4444",
  },
  primary: {
    light: "#2563eb",
    dark: "#3b82f6",
  },
} as const;