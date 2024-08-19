import { Modifier } from "@dnd-kit/core";

export const customModifier: Modifier = ({ transform, active }) => {
  // 假設 LayoutElement 的 data 中有一個 isLayout 屬性
  if (active && active.data.current && active.data.current.isLayout) {
    return {
      ...transform,
      x: 0, // 將 x 設置為 0，只允許垂直移動
    };
  }
  return transform;
};
