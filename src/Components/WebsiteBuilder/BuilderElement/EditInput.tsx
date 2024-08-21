import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import styled from "styled-components";
import { ContentProps } from "../BuilderInterface";
import { commonStyles } from "./commonStyles";

interface EditInputProps {
  value: string;
  $config: any; // 添加这行
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  shouldSelectAll: boolean;
  onSelectComplete: () => void;
}

const HiddenSpan = styled.span<ContentProps>`
  visibility: hidden;
  position: absolute;
  white-space: pre;
  font-size: ${(props) => props.$config.fontSize}px;
  font-weight: ${(props) => props.$config.fontWeight};
  font-family: ${(props) => props.$config.fontFamily};
`;

const StyledInput = styled.input<ContentProps>`
  ${commonStyles}
  width: auto;
  min-width: 1px;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  background: transparent;

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
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState("auto");

  const updateInputWidth = useCallback(() => {
    if (hiddenSpanRef.current) {
      const newWidth = hiddenSpanRef.current.offsetWidth;
      setInputWidth(`${newWidth + 10}px`); // 添加一些额外的空间
    }
  }, []);

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
    updateInputWidth();
  }, [props.value, updateInputWidth]);

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
    <>
      <HiddenSpan ref={hiddenSpanRef} $config={props.$config}>
        {props.value}
      </HiddenSpan>
      <StyledInput
        ref={inputRef}
        {...props}
        style={{ width: inputWidth }}
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
          updateInputWidth();
        }}
        onFocus={() => {
          if (props.shouldSelectAll && inputRef.current) {
            inputRef.current.setSelectionRange(
              0,
              inputRef.current.value.length
            );
          }
        }}
      />
    </>
  );
});

EditInput.displayName = "EditInput";

export default EditInput;
