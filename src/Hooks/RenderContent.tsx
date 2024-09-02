"use client";

import styled from "styled-components";
import { LocalElementType } from "../Components/WebsiteBuilder/BuilderInterface";
import React, { useCallback, useMemo } from "react";
import { useElementContext } from "../Components/WebsiteBuilder/Slider/ElementContext";

interface RenderContentProps {
  type: string;
  config: LocalElementType;
  elementType: string;
  selectedId: string | null;
  onUpdate: (newConfig: Partial<LocalElementType>) => void;
  path?: string[];
}

const Section = styled.div<{ $config: any; $flexDirection?: string }>`
  // border: #2222 1px solid;
  display: flex;
  flex-direction: ${(props) => props.$flexDirection || "row"};
  background-color: ${(props) =>
    props.$config.backgroundColor?.defaultColor || "transparent"};
  opacity: ${(props) =>
    props.$config.backgroundColor?.defaultOpacity !== undefined
      ? props.$config.backgroundColor.defaultOpacity / 100
      : 1};
  ${(props) =>
    props.$config.media?.type === "image" &&
    props.$config.media.url &&
    `
    background-image: url(${props.$config.media.url});
    background-size: cover;
    background-position: center;
  `}
  gap: ${(props) => props.$config.gap || 0}px;
  width: ${(props) =>
    props.$config.size?.width ? `${props.$config.size.width}%` : "100%"};
  height: ${(props) =>
    props.$config.size?.height ? `${props.$config.size.height}px` : "auto"};
  max-width: ${(props) => (props.$config.useMaxWidth ? "100%" : "none")};
  padding: ${(props) =>
    props.$config.boxModelEditor?.padding.join("px ") + "px"};
  margin: ${(props) => props.$config.boxModelEditor?.margin.join("px ") + "px"};
`;

const SectionContent = styled.div<{
  $config: any;
  $width?: string;
  $isSelected?: boolean;
}>`
  width: ${(props) => props.$width || "100%"};
  height: ${(props) =>
    props.$config.size?.height ? `${props.$config.size.height}px` : "100%"};
  background-color: ${(props) =>
    props.$config.backgroundColor?.defaultColor || "transparent"};
  opacity: ${(props) =>
    props.$config.backgroundColor?.defaultOpacity !== undefined
      ? props.$config.backgroundColor.defaultOpacity / 100
      : 1};
  ${(props) =>
    props.$config.media?.type === "image" &&
    props.$config.media.url &&
    `
    background-image: url(${props.$config.media.url});
    background-size: cover;
    background-position: center;
  `}
`;

const GridContainer = styled.div<{
  $config: any;
  $columns: number;
  $gap: number;
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
  gap: ${(props) => props.$gap}px;
  width: 100%;
`;

const RenderContent: React.FC<RenderContentProps> = ({
  type,
  config,
  elementType,
  selectedId,
  onUpdate,
  path = [],
}) => {
  const { handleElementSelect } = useElementContext();
  const { children } = config;

  const renderChild = useCallback(
    (childConfig: any, index: number) => {
      const childPath = [...path, childConfig.id];
      const isChildSelected = childConfig.id === selectedId;

      return (
        <SectionContent
          key={childConfig.id || index}
          $config={childConfig}
          $width={
            childConfig.size?.width ? `${childConfig.size.width}%` : undefined
          }
          $isSelected={isChildSelected}
          onClick={(e) => {
            e.stopPropagation();
            handleElementSelect({ id: childConfig.id, path: childPath });
          }}
        >
          {childConfig.content ||
            RenderContent({
              type: childConfig.type || "default", // 修正這裡的參數傳遞
              config: childConfig,
              elementType: childConfig.elementType,
              selectedId,
              onUpdate: (newChildConfig) => {
                // 創建一個新的 children 數組，將現有的 children 複製到新的數組中
                const newChildren = [...children];
                // 使用新配置更新指定索引的子元素
                newChildren[index] = { ...childConfig, ...newChildConfig };
                // 調用父組件傳遞的 onUpdate 函數，將更新後的 children 數組傳遞回去
                onUpdate({ children: newChildren });
              },
              path: childPath,
            })}
        </SectionContent>
      );
    },
    [path, selectedId, handleElementSelect, children, onUpdate]
  );

  const commonProps = useMemo(
    () => ({
      $config: config,
      $isSelected: config.id === selectedId,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        handleElementSelect({ id: config.id, path: [...path, config.id] });
      },
    }),
    [config, selectedId, handleElementSelect, path]
  );

  const renderedContent = useMemo(() => {
    switch (elementType) {
      case "sidebarLayout":
        return (
          <Section {...commonProps} $flexDirection="row">
            <SectionContent
              $config={config}
              $width={`${config.columnWidths?.left || 30}%`}
            >
              {children && children[0] && renderChild(children[0], 0)}
            </SectionContent>
            <SectionContent
              $config={config}
              $width={`${config.columnWidths?.right || 70}%`}
            >
              {children && children[1] && renderChild(children[1], 1)}
            </SectionContent>
          </Section>
        );

      case "columnizedLayout":
        return (
          <Section {...commonProps} $flexDirection="row">
            <SectionContent
              $config={config}
              $width={`${config.columnWidths?.left || 33.33}%`}
            >
              {children && children[0] && renderChild(children[0], 0)}
            </SectionContent>
            <SectionContent
              $config={config}
              $width={`${config.columnWidths?.middle || 33.33}%`}
            >
              {config.middleColumnSplit ? (
                <>
                  <div style={{ height: "50%" }}>
                    {children && children[1] && renderChild(children[1], 1)}
                  </div>
                  <div style={{ height: "50%" }}>
                    {children && children[2] && renderChild(children[2], 2)}
                  </div>
                </>
              ) : (
                children && children[1] && renderChild(children[1], 1)
              )}
            </SectionContent>
            <SectionContent
              $config={config}
              $width={`${config.columnWidths?.right || 33.33}%`}
            >
              {children &&
                children[config.middleColumnSplit ? 3 : 2] &&
                renderChild(
                  children[config.middleColumnSplit ? 3 : 2],
                  config.middleColumnSplit ? 3 : 2
                )}
            </SectionContent>
          </Section>
        );

      case "gridLayout":
        return (
          <GridContainer
            {...commonProps}
            $columns={config.columns || 3}
            $gap={config.gap || 5}
          >
            {children?.map((child: any, index: number) =>
              renderChild(child, index)
            )}
          </GridContainer>
        );

      default:
        return (
          <SectionContent {...commonProps}>
            {children?.map((child: any, index: number) =>
              renderChild(child, index)
            )}
          </SectionContent>
        );
    }
  }, [elementType, commonProps, config, children, renderChild]);

  return renderedContent;
};

export default React.memo(RenderContent);
