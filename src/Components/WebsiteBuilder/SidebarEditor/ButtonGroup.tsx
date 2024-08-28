import React, { useMemo } from "react";
import styled from "styled-components";

interface ButtonOption {
  label: string;
  value: any;
  icon?: string;
}

interface ButtonGroupProps {
  options: any[];
  value: any;
  onChange: (newValue: any) => void;
  groupKey: string;
  label: string;
}

const ButtonGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // 8px
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem; // 8px
`;

const Button = styled.button<{ $isSelected: boolean }>`
  background-color: ${(props) => (props.$isSelected ? "#e0e0e0" : "white")};
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
`;

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  value,
  onChange,
  groupKey,
  label,
}) => {
  const isAlignment =
    groupKey === "horizontalAlignment" || groupKey === "verticalAlignment";

  const processedOptions = useMemo(
    () =>
      options.map((option: any) =>
        typeof option === "string" ? { label: option, value: option } : option
      ),
    [options]
  );

  const isSelected = (optionValue: any): boolean => {
    if (isAlignment) {
      return JSON.stringify(value) === JSON.stringify(optionValue);
    }
    return value === optionValue;
  };

  const handleClick = (optionValue: any) => {
    if (isSelected(optionValue)) {
      onChange(null);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <ButtonGroupWrapper>
      <Label>{label}</Label>
      <ButtonsContainer>
        {processedOptions.map((option, index) => (
          <Button
            key={`${groupKey}-${option.value}-${index}`}
            $isSelected={isSelected(option.value)}
            onClick={() => handleClick(option.value)}
            title={option.label}
          >
            {option.icon ? (
              <div dangerouslySetInnerHTML={{ __html: option.icon }} />
            ) : (
              option.label
            )}
          </Button>
        ))}
      </ButtonsContainer>
    </ButtonGroupWrapper>
  );
};

export default ButtonGroup;
