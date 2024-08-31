import React from "react";
import styled from "styled-components";

interface LayoutPreviewProps {
  type: string;
  children: React.ReactNode;
}

interface PlaceholderBoxProps {
  $height?: string;
  $width?: string;
  $position?: string;
  $top?: string;
  $left?: string;
}

const PreviewContainer = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Layout = styled.div`
  width: 100%;
  height: 100px;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const PlaceholderBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: calc(100% / 3);
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  width: 100%;
  height: 100%;
`;

const ColumnizedLayout = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
  height: 100%;
`;

const SidebarLayout = styled.div`
  display: flex;
  gap: 5px;
  width: 100%;
  height: 100%;
`;

const FreeformLayout = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const PlaceholderBox = styled.div<PlaceholderBoxProps>`
  border: 1px dashed ${(props) => props.theme.colors.border};
  height: ${(props) => props.$height || "100%"};
  width: ${(props) => props.$width || "auto"};
  position: ${(props) => props.$position || "static"};
  top: ${(props) => props.$top || "auto"};
  left: ${(props) => props.$left || "auto"};
`;

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({
  type,
  children,
}) => {
  const renderPreview = () => {
    switch (type) {
      case "layout":
        return <Layout />;
      case "sidebarLayout":
        return (
          <SidebarLayout>
            <PlaceholderBox $width="30%"></PlaceholderBox>
            <PlaceholderBox $width="70%"></PlaceholderBox>
          </SidebarLayout>
        );
      case "columnizedLayout":
        return (
          <ColumnizedLayout>
            <PlaceholderBox $width="calc(100% / 3)" />
            <PlaceholderBoxWrapper>
              <PlaceholderBox $height="50%" />
              <PlaceholderBox $height="50%" />
            </PlaceholderBoxWrapper>
            <PlaceholderBox $width="calc(100% / 3)" />
          </ColumnizedLayout>
        );
      case "gridLayout":
        return (
          <GridLayout>
            {[...Array(9)].map((_, i) => (
              <PlaceholderBox key={i} />
            ))}
          </GridLayout>
        );
      case "freeformLayout":
        return (
          <FreeformLayout>
            <PlaceholderBox
              $width="40%"
              $height="40%"
              $position="absolute"
              $top="10%"
              $left="10%"
            />
            <PlaceholderBox
              $width="30%"
              $height="30%"
              $position="absolute"
              $top="30%"
              $left="60%"
            />
            <PlaceholderBox
              $width="20%"
              $height="20%"
              $position="absolute"
              $top="60%"
              $left="40%"
            />
          </FreeformLayout>
        );
      default:
        return <PlaceholderBox>{children}</PlaceholderBox>;
    }
  };

  return <PreviewContainer>{renderPreview()}</PreviewContainer>;
};
