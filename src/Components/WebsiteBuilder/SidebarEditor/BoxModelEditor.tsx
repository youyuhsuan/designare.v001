import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const BoxModelVisualization = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BaseBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #333;
`;

const MarginBox = styled(BaseBox)`
  width: 90%;
  height: 90%;
  background-color: #f0f0f0;
  &::hover {
    background-color: #f1cda5;
  }
`;

const BorderBox = styled(BaseBox)`
  width: 70%;
  height: 70%;
  background-color: #e0e0e0;
  &::hover {
    background-color: #f7dea3;
  }
`;

const PaddingBox = styled(BaseBox)`
  width: 50%;
  height: 50%;
  background-color: #d0d0d0;
  &::hover {
    background-color: #c5cf93;
  }
`;

const ContentBox = styled(BaseBox)`
  width: 30%;
  height: 30%;
  background-color: ${(props) => props.theme.colors.background};
  border: none;
  &::hover {
    background-color: #95b5c0;
  }
`;

const Label = styled.div`
  position: absolute;
  font-size: 12px;
  color: ${(props) => props.theme.colors.border};
`;

const MarginLabel = styled(Label)`
  top: 5px;
  left: 5px;
`;

const BorderLabel = styled(Label)`
  top: 5px;
  left: 5px;
`;

const PaddingLabel = styled(Label)`
  top: 5px;
  left: 5px;
`;

const PropertyInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
`;

const PropertyLabel = styled.div`
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  text-transform: capitalize;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InputLabel = styled.label`
  min-width: 50px;
  color: ${(props) => props.theme.colors.text};
`;

const Input = styled.input`
  width: 60px;
  padding: 5px;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.border};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

interface BoxModelValues {
  margin: [number, number, number, number];
  padding: [number, number, number, number];
}

interface BoxModelEditorProps {
  value?: BoxModelValues;
  onChange: (value: BoxModelValues) => void;
}

const defaultValue: BoxModelValues = {
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
};

const BoxModelEditor: React.FC<BoxModelEditorProps> = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState<BoxModelValues>(() => {
    console.log("Initial value:", value);
    return value || defaultValue;
  });

  useEffect(() => {
    console.log("Value changed:", value);
    if (value) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = useCallback(
    (property: "margin" | "padding", index: number, newValue: string) => {
      const numValue = newValue === "" ? 0 : parseFloat(newValue);
      if (!isNaN(numValue)) {
        const updatedValues = {
          ...localValue,
          [property]: localValue[property].map((v, i) =>
            i === index ? numValue : v
          ) as [number, number, number, number],
        };
        console.log("Updated local value:", updatedValues);
        setLocalValue(updatedValues);
        onChange(updatedValues);
      }
    },
    [localValue, onChange]
  );

  const renderInput = useCallback(
    (property: "margin" | "padding", index: number, label: string) => (
      <InputWrapper key={`${property}-${label}`}>
        <InputLabel>{`${property} ${label}`}</InputLabel>
        <Input
          type="number"
          value={localValue[property][index]}
          onChange={(e) => handleChange(property, index, e.target.value)}
          onBlur={(e) => {
            const numValue = parseFloat(e.target.value) || 0;
            handleChange(property, index, numValue.toString());
          }}
        />
      </InputWrapper>
    ),
    [localValue, handleChange]
  );

  if (!localValue) {
    console.error("BoxModelEditor: localValue is undefined");
    return <div>Error: Unable to load box model editor</div>;
  }

  return (
    <EditorContainer>
      <BoxModelVisualization>
        <MarginBox>
          <MarginLabel>margin</MarginLabel>
          <BorderBox>
            <BorderLabel>border</BorderLabel>
            <PaddingBox>
              <PaddingLabel>padding</PaddingLabel>
              <ContentBox></ContentBox>
            </PaddingBox>
          </BorderBox>
        </MarginBox>
      </BoxModelVisualization>
      {(["margin", "padding"] as const).map((property) => (
        <PropertyInputs key={property}>
          <PropertyLabel>{property}</PropertyLabel>
          {renderInput(property, 0, "top")}
          {renderInput(property, 1, "right")}
          {renderInput(property, 2, "bottom")}
          {renderInput(property, 3, "left")}
        </PropertyInputs>
      ))}
    </EditorContainer>
  );
};

export default BoxModelEditor;
