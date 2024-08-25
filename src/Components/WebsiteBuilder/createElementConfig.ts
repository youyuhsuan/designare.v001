interface ElementConfig {
  [key: string]: any; // 这里可以更具体地定义配置项
}

const createLayoutConfig = (properties: any): ElementConfig => ({
  size: {
    width: properties.size.defaultValue.width,
    height: properties.size.defaultValue.height,
  },
  responsiveBehavior: properties.responsiveBehavior.defaultValue,
  useMaxWidth: properties.useMaxWidth.defaultValue,
  boxModelEditor: {
    padding: properties.boxModelEditor.defaultValue.padding,
    margin: properties.boxModelEditor.defaultValue.margin,
  },
  backgroundColor: {
    defaultColor: properties.backgroundColor.defaultColor,
    defaultOpacity: properties.backgroundColor.defaultOpacity,
  },
  media: properties.media.defaultValue,
});

const createTextConfig = (
  properties: any,
  elementType: string
): ElementConfig => ({
  size: properties.size.defaultValue(elementType),
  fontSize: properties.fontSize.defaultValue(elementType),
  fontType: properties.fontType.defaultValue(elementType),
  textColor: properties.textColor.defaultValue,
  letterSpacing: properties.letterSpacing.defaultValue,
  lineHeight: properties.lineHeight.defaultValue(elementType),
  fontFamily: properties.fontFamily.defaultValue,
});

const createFreeDraggableConfig = (properties: any): ElementConfig => ({
  horizontalAlignment: properties.horizontalAlignment.defaultValue,
  verticalAlignment: properties.verticalAlignment.defaultValue,
  distribution: properties.distribution.defaultValue,
  position: properties.position.defaultValue,
});

const configCreators = {
  layout: createLayoutConfig,
  text: createTextConfig,
  freeDraggable: createFreeDraggableConfig,
};

export function createElementConfig(
  type: string,
  isLayout: boolean,
  elementType: string = "",
  configs: any
): ElementConfig {
  if (isLayout) {
    return configCreators.layout(configs.layout.properties);
  }

  if (type === "text") {
    return {
      ...configCreators.freeDraggable(configs.freeDraggable.properties),
      ...configCreators.text(
        configs.freeDraggable.subtypes.text.properties,
        elementType
      ),
    };
  }

  return configCreators.freeDraggable(configs.freeDraggable.properties);
}
