import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  min-height: 100dvh;
  background-color: ${(props) => props.theme.colors.background};
  margin: 0 auto;
  box-shadow: 0 0 10px ${(props) => props.theme.colors.shadow};
  overflow: auto;
`;

interface SiteContainerProps {
  children: React.ReactNode;
  width?: string;
}

export const SiteContainer: React.FC<SiteContainerProps> = ({
  children,
  width = "1200px",
}) => <Container style={{ maxWidth: width }}>{children}</Container>;
