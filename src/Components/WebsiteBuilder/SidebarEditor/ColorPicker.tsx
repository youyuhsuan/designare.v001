import React, { useEffect, useState } from "react";
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

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  opacity,
  defaultColor,
  defaultOpacity,
  onChange,
}) => {
  const parseColor = (inputColor: string): RgbaColor => {
    const [r, g, b, a] = parseToRgba(inputColor || defaultColor);
    return { r, g, b, a: a !== undefined ? a : opacity / 100 };
  };

  const [currentColor, setCurrentColor] = useState(parseColor(color));

  useEffect(() => {
    setCurrentColor(parseColor(color));
  }, [color, opacity]);

  const handleChange = (newColor: RgbaColor) => {
    setCurrentColor(newColor);
    const { r, g, b, a } = newColor;
    const newColorString = `rgba(${r}, ${g}, ${b}, ${a})`;
    onChange(newColorString, Math.round(a * 100));
  };

  return (
    <div>
      <RgbaColorPicker color={currentColor} onChange={handleChange} />
      <div>
        <label>Opacity: {Math.round(currentColor.a * 100)}%</label>
      </div>
    </div>
  );
};
