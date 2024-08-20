"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";

interface EditableComponentProps {
  id: string;
  content: string;
  config: any;
  type: "text" | "button";
  onUpdate: (update: { content: string }) => void;
}

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StyledText = styled.div<{ $config: any }>`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  ${({ $config }) => `
    font-size: ${$config.fontSize}px;
    font-weight: ${$config.fontWeight};
    text-align: ${$config.textAlign};
    color: ${$config.textColor};
  `}
`;

const StyledInput = styled(StyledText).attrs({ as: "input" })`
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  outline: none;
  background: transparent;
`;

const EditableComponent: React.FC<EditableComponentProps> = ({
  id,
  content,
  config,
  type,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Double click detected");
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    console.log("Blur event triggered");
    setIsEditing(false);
    if (editableContent !== content) {
      onUpdate({ content: editableContent });
    }
  }, [editableContent, content, onUpdate]);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditableContent(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (isEditing && inputRef.current) {
      console.log("Focusing input");
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, editableContent.length);
    }
  }, [isEditing, editableContent]);

  useEffect(() => {
    console.log("isEditing state changed:", isEditing);
  }, [isEditing]);

  return (
    <StyledContainer onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <StyledInput
          ref={inputRef}
          value={editableContent}
          $config={config}
          onChange={handleContentChange}
          onBlur={handleBlur}
        />
      ) : (
        <StyledText $config={config}>{content}</StyledText>
      )}
    </StyledContainer>
  );
};

export default EditableComponent;
