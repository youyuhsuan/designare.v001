import React, { forwardRef } from "react";
import styled, { css } from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: "primary" | "secondary" | "danger" | "accent";
}

const buttonStyles = css<ButtonProps>`
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  transition: ${(props) => props.theme.transition};
  gap: 8px;
  ${(props) => {
    const variant = props.$variant || "primary";
    return css`
      background-color: ${props.theme.button.backgroundColor[variant]};
      color: ${props.theme.button[variant]};
      &:hover {
        opacity: 0.8;
      }
      &:active {
        opacity: 0.6;
      }
      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${props.theme.colors.primary}33;
      }
    `;
  }}
`;

const StyledButton = styled.button<ButtonProps>`
  ${buttonStyles}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, $variant = "primary", ...rest }, ref) => {
    return (
      <StyledButton $variant={$variant} {...rest} ref={ref}>
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = "Button";
