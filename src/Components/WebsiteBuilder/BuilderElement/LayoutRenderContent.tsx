import styled from "styled-components";
import LayoutElement from "./LayoutElement";
import { LocalElementType } from "../BuilderInterface";

interface ContentProps {
  $config: any;
}

interface BaseElementType {
  id: string;
  type: string;
  isLayout: boolean;
  content: string;
  config: any;
}

interface LayoutConfig extends BaseElementType {
  properties: any;
  children?: LayoutConfig[];
}

interface RenderContentProps {
  config: LayoutConfig;
  onUpdate: (newConfig: Partial<LayoutConfig>) => void;
}

const Section = styled.div<ContentProps>`
  background-color: ${(props) =>
    props.$config.backgroundColor || "transparent"};
  opacity: ${(props) => {
    const opacity = props.$config.backgroundOpacity;
    if (opacity === undefined) return 1;
    return opacity / 100; // 將 0-100 的範圍轉換為 0-1
  }};
  ${(props) =>
    props.$config.media?.type === "image" &&
    `
    background-image: url(${props.$config.media.url});
    background- size: cover;
    background-position: center;
  `}
  gap: ${(props) => props.$config.gap};
`;

const SectionContent = styled.div<ContentProps>`
  height: 100%;
  background-color: ${(props) =>
    props.$config.backgroundColor || "transparent"};
  opacity: ${(props) => {
    const opacity = props.$config.backgroundOpacity;
    if (opacity === undefined) return 1;
    return opacity / 100; // 將 0-100 的範圍轉換為 0-1
  }};
  ${(props) =>
    props.$config.media?.type === "image" &&
    `
    background-image: url(${props.$config.media.url});
    background- size: cover;
    background-position: center;
  `}
`;

const GridContainer = styled.div<{ columns: number; gap: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: ${(props) => props.gap}px;
`;

const FreeformContainer = styled.div`
  position: relative;
  height: 100%;
`;

const FreeformItem = styled.div<{
  width: string;
  height: string;
  top: string;
  left: string;
}>`
  position: absolute;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
`;

export const renderContent = ({
  config,
  onUpdate,
}: RenderContentProps): React.ReactNode => {
  if (!config) {
    console.error("配置对象为 null 或 undefined");
  } else if (!config.properties) {
    console.error("配置对象缺少 properties 属性", config);
  }

  if (!config || !config.properties) {
    console.error("Invalid config in renderContent", config);
    return <div>Invalid configuration</div>;
  }
  const { type, properties, children } = config;

  const renderChild = (childConfig: LocalElementType, index: number) => (
    <LayoutElement
      key={childConfig.id}
      {...childConfig}
      isLayout={true}
      config={childConfig.properties} // 将 properties 映射到 config
      onUpdate={(newChildConfig) => {
        const newChildren = [...(children || [])];
        // 将 config 映射回 properties
        newChildren[index] = {
          ...childConfig,
          ...newChildConfig,
          properties: newChildConfig.config || childConfig.properties,
        } as LayoutConfig;
        onUpdate({ children: newChildren });
      }}
      onDelete={() => {
        const newChildren =
          config.children?.filter((_, i) => i !== index) || [];
        onUpdate({ children: newChildren });
      }}
      isSelected={false}
      onMouseUp={() => {}}
    />
  );

  switch (type) {
    case "sidebarLayout":
      return (
        <Section $config={properties}>
          <SectionContent
            $config={properties}
            style={{ width: `${properties.columnWidths?.left || 30}%` }}
          >
            {children && children[0] && renderChild(children[0], 0)}
          </SectionContent>
          <SectionContent
            $config={properties}
            style={{ width: `${properties.columnWidths?.right || 70}%` }}
          >
            {children && children[1] && renderChild(children[1], 1)}
          </SectionContent>
        </Section>
      );

    case "columnizedLayout":
      return (
        <Section $config={properties}>
          <SectionContent
            $config={properties}
            style={{ width: `${properties.columnWidths?.left || 33.33}%` }}
          >
            {children && children[0] && renderChild(children[0], 0)}
          </SectionContent>
          <SectionContent
            $config={properties}
            style={{ width: `${properties.columnWidths?.middle || 33.33}%` }}
          >
            {properties.middleColumnSplit ? (
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
            $config={properties}
            style={{ width: `${properties.columnWidths?.right || 33.33}%` }}
          >
            {children &&
              children[properties.middleColumnSplit ? 3 : 2] &&
              renderChild(
                children[properties.middleColumnSplit ? 3 : 2],
                properties.middleColumnSplit ? 3 : 2
              )}
          </SectionContent>
        </Section>
      );

    case "gridLayout":
      return (
        <GridContainer
          columns={properties.columns || 3}
          gap={properties.gap || 5}
        >
          {children?.map((child, index) => renderChild(child, index))}
        </GridContainer>
      );

    case "freeformLayout":
      return (
        <FreeformContainer>
          {children?.map((child, index) => (
            <FreeformItem
              key={index}
              width={child.properties.width}
              height={child.properties.height}
              top={child.properties.top}
              left={child.properties.left}
            >
              {renderChild(child, index)}
            </FreeformItem>
          ))}
        </FreeformContainer>
      );

    default:
      return (
        <SectionContent $config={properties}>
          {children?.map((child, index) => renderChild(child, index))}
        </SectionContent>
      );
  }
};
