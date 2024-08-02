import Link from "next/link";
import styled from "styled-components";

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 1rem;
`;

export const Wrapper = styled.div`
  ${(props) => props.theme.inputs.wrapper}
`;

export const Input = styled.input`
  ${(props) => props.theme.inputs.input}
`;

export const Label = styled.label`
  ${(props) => props.theme.inputs.label}
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ccc;
  }
  span {
    padding: 0 10px;
  }
`;

export const Footer = styled.footer`
  text-align: center;
  margin-top: 1rem;
`;

export const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem; // Adjust as needed
`;

export const ForgotPassword = styled(Link)`
  && {
    color: #0070f3;
    text-decoration: none;
    text-align: right;
  }
`;

export const ErrorMessage = styled.span`
  ${(props) => props.theme.inputs.error}
`;

export const SuccessMessage = styled.span`
  ${(props) => props.theme.inputs.error}
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
`;
