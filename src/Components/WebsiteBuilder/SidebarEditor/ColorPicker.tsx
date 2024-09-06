import React, { useCallback, useEffect, useState } from "react";
import { RgbaColorPicker, RgbaColor } from "react-colorful";
import { parseToRgba, rgba } from "color2k";

interface ColorPickerProps {
  id: string;
  color: string;
  opacity: number;
  defaultColor: string;
  defaultOpacity: number;
  onChange: (color: string, opacity: number) => void;
}
const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  opacity,
  defaultColor,
  defaultOpacity,
  onChange,
}) => {
  const parseColor = useCallback(
    (inputColor: string): RgbaColor => {
      if (
        inputColor === "transparent" ||
        defaultColor === "transparent" ||
        inputColor === "undefined" ||
        defaultColor === "undefined"
      ) {
        return { r: 0, g: 0, b: 0, a: 0 }; // 透明色
      }
      console.log("inputColor defaultColor", inputColor, defaultColor);
      const [r, g, b, a] = parseToRgba(inputColor || defaultColor);
      return { r, g, b, a: a !== undefined ? a : opacity / 100 };
    },
    [defaultColor, opacity]
  );

  const [currentColor, setCurrentColor] = useState(parseColor(color));

  useEffect(() => {
    setCurrentColor(parseColor(color));
  }, [color, opacity, parseColor]);

  const handleChange = (newColor: RgbaColor) => {
    setCurrentColor(newColor);
    const { r, g, b, a } = newColor;
    const newColorString = `rgba(${r}, ${g}, ${b}, ${a})`;
    onChange(newColorString, Math.round(a * 100));
  };

  return (
    <>
      <RgbaColorPicker color={currentColor} onChange={handleChange} />
    </>
  );
};

export default ColorPicker;
