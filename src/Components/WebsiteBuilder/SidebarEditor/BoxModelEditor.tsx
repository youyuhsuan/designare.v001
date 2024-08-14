import React, { useState } from "react";
import styled from "styled-components";

interface BoxModelEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const EditorContainer = styled.div`
  width: 200px;
  height: 200px;
  position: relative;
  border: 1px solid #ccc;
`;

const Input = styled.input`
  width: 40px;
  position: absolute;
  text-align: center;
`;

const TopInput = styled(Input)`
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
`;

const RightInput = styled(Input)`
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
`;

const BottomInput = styled(Input)`
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
`;

const LeftInput = styled(Input)`
  top: 50%;
  left: 5px;
  transform: translateY(-50%);
`;

const BoxModelEditor: React.FC<BoxModelEditorProps> = ({
  value,
  onChange,
  label,
}) => {
  const [values, setValues] = useState(() => {
    const parts = value.split(" ");
    if (parts.length === 1) {
      return {
        top: parts[0],
        right: parts[0],
        bottom: parts[0],
        left: parts[0],
      };
    }
    if (parts.length === 2) {
      return {
        top: parts[0],
        right: parts[1],
        bottom: parts[0],
        left: parts[1],
      };
    }
    if (parts.length === 4) {
      return {
        top: parts[0],
        right: parts[1],
        bottom: parts[2],
        left: parts[3],
      };
    }
    return { top: "0px", right: "0px", bottom: "0px", left: "0px" };
  });

  const handleChange = (
    side: "top" | "right" | "bottom" | "left",
    newValue: string
  ) => {
    const updatedValues = { ...values, [side]: newValue };
    setValues(updatedValues);
    onChange(
      `${updatedValues.top} ${updatedValues.right} ${updatedValues.bottom} ${updatedValues.left}`
    );
  };

  return (
    <EditorContainer>
      <TopInput
        value={values.top}
        onChange={(e) => handleChange("top", e.target.value)}
      />
      <RightInput
        value={values.right}
        onChange={(e) => handleChange("right", e.target.value)}
      />
      <BottomInput
        value={values.bottom}
        onChange={(e) => handleChange("bottom", e.target.value)}
      />
      <LeftInput
        value={values.left}
        onChange={(e) => handleChange("left", e.target.value)}
      />
      <div style={{ textAlign: "center", paddingTop: "85px" }}>{label}</div>
    </EditorContainer>
  );
};

export default BoxModelEditor;
