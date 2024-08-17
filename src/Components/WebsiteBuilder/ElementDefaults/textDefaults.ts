type TextDefaults = {
  [key: string]: {
    size: Record<string, any>;
    fontSize: number;
    fontWeight: "bold" | "normal";
    lineHeight: number;
  };
};

export const textDefaults: TextDefaults = {
  H1: {
    size: { width: 600, height: 86 },
    fontSize: 72,
    fontWeight: "bold",
    lineHeight: 1.2,
  },
  H2: {
    size: { width: 600, height: 55 },
    fontSize: 42,
    fontWeight: "bold",
    lineHeight: 1.3,
  },
  H3: {
    size: { width: 600, height: 49 },
    fontSize: 38,
    fontWeight: "bold",
    lineHeight: 1.4,
  },
  H4: {
    size: { width: 600, height: 44 },
    fontSize: 34,
    fontWeight: "bold",
    lineHeight: 1.4,
  },
  H5: {
    size: { width: 600, height: 31 },
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 1.5,
  },
  pre1: {
    size: { width: 390, height: 86 },
    fontSize: 28,
    fontWeight: "normal",
    lineHeight: 1.6,
  },
  pre2: {
    size: { width: 410, height: 77 },
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: 1.6,
  },
  pre3: {
    size: { width: 400, height: 45 },
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 1.6,
  },
} as const;
// as const 只讀

export type TextType = keyof typeof textDefaults;
