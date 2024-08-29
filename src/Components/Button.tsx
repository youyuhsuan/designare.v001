import React, { forwardRef } from "react";
import styled, { css } from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: "filled" | "outlined" | "text";
  $color?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "accent"
    | "danger"
    | "success"
    | "warning"
    | "info";
  $size?: "small" | "medium" | "large";
  $isSelected?: boolean;
  $fullWidth?: boolean; // 新增 $fullWidth 屬性
}

const buttonStyles = css<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  transition: ${(props) => props.theme.transition};
  gap: 8px;
  font-size: 1rem;
  font-weight: 500;
  width: ${(props) =>
    props.$fullWidth ? "100%" : "auto"}; // 根據 $fullWidth 設置寬度

  ${(props) => {
    const color = props.$color || "primary";
    const variant = props.$variant || "filled";
    const size = props.$size || "medium";

    switch (size) {
      case "small":
        return css`
          padding: 0.4rem 0.8rem;
          font-size: 0.875rem;
        `;
      case "large":
        return css`
          padding: 0.8rem 1.6rem;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 0.625rem 1.25rem;
          font-size: 1rem;
        `;
    }
  }}

  ${(props) => {
    const color = props.$color || "primary";
    const variant = props.$variant || "filled";

    switch (variant) {
      case "outlined":
        return css`
          background-color: transparent;
          border: 2px solid ${props.theme.button.outlined[color]};
          color: ${props.theme.button.text[color]};
          &:hover {
            background-color: ${props.theme.button.hover[color]};
          }
        `;
      case "text":
        return css`
          background-color: transparent;
          color: ${props.theme.button.text[color]};
          padding: 0.625rem;
          &:hover {
            background-color: ${props.theme.button.hover[color]};
          }
        `;
      default:
        return css`
          background-color: ${props.theme.button.background[color]};
          color: ${props.theme.button.text[color]};
          &:hover {
            background-color: ${props.theme.button.hover[color]};
          }
        `;
    }
  }}

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary}33;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledButton = styled.button<ButtonProps>`
  ${buttonStyles}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      $variant = "filled",
      $color = "primary",
      $size = "medium",
      $fullWidth = false, // 設置 $fullWidth 的默認值
      ...rest
    },
    ref
  ) => {
    return (
      <StyledButton
        $variant={$variant}
        $color={$color}
        $size={$size}
        $fullWidth={$fullWidth} // 傳遞 $fullWidth 屬性
        {...rest}
        ref={ref}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = "Button";

export { StyledButton };
