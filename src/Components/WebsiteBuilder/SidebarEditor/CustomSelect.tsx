import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaAngleDown } from "react-icons/fa";

interface CustomSelectProps {
  options: string[];
  value?: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  id: string;
}

const StyledChevronDown = styled(FaAngleDown)<{ $isOpen: boolean }>`
  transition: transform 0.2s;
  transform: ${(props) => (props.$isOpen ? "rotate(180deg)" : "rotate(0)")};
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

const SelectButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.375rem;
  background-color: ${(props) => props.theme.colors.background};
  box-shadow: 0 1px 2px ${(props) => props.theme.colors.shadow};
  padding: 8px 12px;
  cursor: pointer;
  width: 100%;
  &:focus {
    border-color: ${(props) => props.theme.colors.accent};
    outline: none;
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.accent};
  }
`;

const OptionsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.375rem;
  background-color: ${(props) => props.theme.colors.background};
  z-index: 1;
  max-height: 200px;
  overflow-y: auto;
`;

const Option = styled.div`
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.accentBorder};
  }
`;

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SelectWrapper ref={selectRef}>
      <SelectButton onClick={() => setIsOpen(!isOpen)}>
        <span>{value}</span>
        <StyledChevronDown $isOpen={isOpen} />
      </SelectButton>
      {isOpen && (
        <OptionsList>
          {options.map((option) => (
            <Option
              key={option}
              onClick={() => {
                onChange({
                  target: { value: option },
                } as React.ChangeEvent<HTMLSelectElement>);
                setIsOpen(false);
              }}
            >
              {option}
            </Option>
          ))}
        </OptionsList>
      )}
    </SelectWrapper>
  );
};

export default CustomSelect;
