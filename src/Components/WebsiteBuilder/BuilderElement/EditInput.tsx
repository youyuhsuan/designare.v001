import React, { forwardRef, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";

import { ContentProps } from "../BuilderInterface";

interface EditInputProps {
  value: string;
  $config: any; // 添加这行
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  shouldSelectAll: boolean;
  onSelectComplete: () => void;
}

const StyledInput = styled.input<ContentProps>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  resize: none;
  overflow: hidden;
  font-size: ${(props) => props.$config.fontSize}px;
  font-weight: ${(props) => props.$config.fontWeight};
  text-align: ${(props) => props.$config.textAlign};
  color: ${(props) => props.$config.textColor};
  opacity: ${(props) => props.$config.opacity};
  font-family: ${(props) => props.$config.fontFamily};
  &::selection {
    background-color: ${(props) => props.theme.colors.accent};
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.accent};
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.accent};
  }
`;

const EditInput = forwardRef<HTMLInputElement, EditInputProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(inputRef.current);
      } else {
        ref.current = inputRef.current;
      }
    }
  }, [ref]);

  useEffect(() => {
    if (inputRef.current && props.shouldSelectAll) {
      console.log("Attempting to select all text");
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, inputRef.current.value.length);
      console.log("Text selected:", inputRef.current.value);
      props.onSelectComplete();
    }
  }, [props.shouldSelectAll, props.onSelectComplete, props]);

  return (
    <StyledInput
      ref={inputRef}
      {...props}
      onKeyDown={(e) => {
        console.log("Key pressed in EditInput:", e.key);
        if (e.key === "Enter") {
          e.preventDefault();
          props.onBlur();
        }
      }}
      onChange={(e) => {
        console.log("Input changed:", e.target.value);
        props.onChange(e);
      }}
      onFocus={() => {
        if (props.shouldSelectAll && inputRef.current) {
          inputRef.current.setSelectionRange(0, inputRef.current.value.length);
        }
      }}
    />
  );
});

EditInput.displayName = "EditInput";

export default EditInput;
