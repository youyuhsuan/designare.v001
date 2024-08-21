type TextDefaults = {
  [key: string]: {
    fontSize: number;
    fontWeight: "bold" | "normal";
    lineHeight: number;
  };
};

export const textDefaults: TextDefaults = {
  H1: {
    fontSize: 72,
    fontWeight: "bold",
    lineHeight: 1.2,
  },
  H2: {
    fontSize: 42,
    fontWeight: "bold",
    lineHeight: 1.3,
  },
  H3: {
    fontSize: 38,
    fontWeight: "bold",
    lineHeight: 1.4,
  },
  H4: {
    fontSize: 34,
    fontWeight: "bold",
    lineHeight: 1.4,
  },
  H5: {
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 1.5,
  },
  pre1: {
    fontSize: 28,
    fontWeight: "normal",
    lineHeight: 1.6,
  },
  pre2: {
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: 1.6,
  },
  pre3: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 1.6,
  },
} as const;
// as const 只讀

export type TextType = keyof typeof textDefaults;
