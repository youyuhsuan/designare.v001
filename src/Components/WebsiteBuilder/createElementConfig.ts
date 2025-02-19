interface ElementConfig {
  [key: string]: any;
}

const createLayoutElementConfig = (properties: any): ElementConfig => ({
  size: {
    width: properties.size.defaultValue.width,
    height: properties.size.defaultValue.height,
  },
  responsiveBehavior: properties.responsiveBehavior.defaultValue,
  useMaxWidth: properties.useMaxWidth.defaultValue,
  boxModelEditor: {
    padding: properties.boxModelEditor.defaultValue.padding || 20,
    margin: properties.boxModelEditor.defaultValue.margin || 0,
  },
  backgroundColor: properties.backgroundColor.defaultValue,
  media: properties.media.defaultValue,
});

const createLayoutConfig = (
  properties: any,
  elementType: string
): ElementConfig => ({
  gap: properties.gap.defaultValue[
    elementType as keyof typeof properties.gap.defaultValue
  ],
  columnWidths:
    properties.columnWidths.defaultValue[
      elementType as keyof typeof properties.columnWidths.defaultValue
    ],
  columns:
    properties.columns.defaultValue[
      elementType as keyof typeof properties.columns.defaultValue
    ],
  middleColumnSplit:
    properties.middleColumnSplit.defaultValue[
      elementType as keyof typeof properties.middleColumnSplit.defaultValue
    ],
  rowHeight:
    properties.rowHeight.defaultValue[
      elementType as keyof typeof properties.rowHeight.defaultValue
    ],
  boxModelEditor: {
    padding: properties.boxModelEditor.defaultValue.padding,
    margin: properties.boxModelEditor.defaultValue.margin,
  },
  backgroundColor: properties.backgroundColor.defaultValue,
  media: properties.media.defaultValue,
});

const createButtonElementConfig = (
  properties: any,
  elementType: string
): ElementConfig => ({
  content: properties.content.defaultValue,
  size: {
    width: properties.size.defaultValue.width,
    height: properties.size.defaultValue.height,
  },
  boxModelEditor: {
    padding: properties.boxModelEditor.defaultValue.padding,
    margin: properties.boxModelEditor.defaultValue.margin,
  },
  fontSize: properties.fontSize.defaultValue,
  textColor:
    properties.textColor.defaultValue[
      elementType as keyof typeof properties.textColor.defaultValue
    ],
  fontFamily: properties.fontFamily.defaultValue,
  backgroundColor:
    properties.backgroundColor.defaultValue[
      elementType as keyof typeof properties.backgroundColor.defaultValue
    ],
  borderWidth:
    properties.borderWidth.defaultValue[
      elementType as keyof typeof properties.borderWidth.defaultValue
    ],
  borderStyle:
    properties.borderWidth.defaultValue[
      elementType as keyof typeof properties.borderStyle.defaultValue
    ],
  borderColor:
    properties.borderWidth.defaultValue[
      elementType as keyof typeof properties.borderColor.defaultValue
    ],
  borderRadius: properties.borderRadius.defaultValue,
  hoverBackgroundColor:
    properties.hoverBackgroundColor.defaultValue[
      elementType as keyof typeof properties.hoverBackgroundColor.defaultValue
    ],
  activeBackgroundColor:
    properties.activeBackgroundColor.defaultValue[
      elementType as keyof typeof properties.activeBackgroundColor.defaultValue
    ],
});

const createImageConfig = (
  properties: any,
  elementType: string
): ElementConfig => ({
  size: properties.size.defaultValue[
    elementType as keyof typeof properties.size.defaultValue
  ],
  media: properties.media.defaultValue,
  alt: properties.alt.defaultValue,
  border: properties.border.defaultValue,
  borderRadius:
    properties.borderRadius.defaultValue[
      elementType as keyof typeof properties.borderRadius.defaultValue
    ],
  objectFit: properties.objectFit.defaultValue,
});

const createTextConfig = (
  properties: any,
  elementType: string
): ElementConfig => ({
  size: properties.size.defaultValue[
    elementType as keyof typeof properties.size.defaultValue
  ],
  fontSize:
    properties.fontSize.defaultValue[
      elementType as keyof typeof properties.fontSize.defaultValue
    ],
  textColor: properties.textColor.defaultValue,
  letterSpacing: properties.letterSpacing.defaultValue,
  lineHeight:
    properties.lineHeight.defaultValue[
      elementType as keyof typeof properties.lineHeight.defaultValue
    ],
  fontFamily: properties.fontFamily.defaultValue,
  fontWeight: properties.fontWeight.defaultValue,
  textDecoration: properties.textDecoration.defaultValue,
});

const createFreeDraggableElementConfig = (properties: any): ElementConfig => ({
  horizontalAlignment: properties.horizontalAlignment.defaultValue,
  verticalAlignment: properties.verticalAlignment.defaultValue,
  position: properties.position.defaultValue,
});

const configCreators = {
  layoutElement: createLayoutElementConfig,
  layout: createLayoutConfig,
  text: createTextConfig,
  image: createImageConfig,
  buttonElement: createButtonElementConfig,
  freeDraggableElement: createFreeDraggableElementConfig,
};

export function createElementConfig(
  type: string,
  isLayout: boolean,
  elementType: string = "",
  configs: any
): Partial<ElementConfig> {
  let baseConfig: Partial<ElementConfig>;
  if (isLayout) {
    switch (elementType) {
      case "layout":
      case "sidebarLayout":
      case "columnizedLayout":
      case "gridLayout":
        baseConfig = {
          ...configCreators.layoutElement(configs.layoutElement.properties),
          ...configCreators.layout(
            configs.layoutElement.subtypes.layout.properties,
            elementType
          ),
        };
        break;
      case "child":
        baseConfig = {
          ...configCreators.layoutElement(configs.layoutElement.properties),
        };
        break;
      default:
        baseConfig = {
          ...configCreators.layoutElement(configs.layoutElement.properties),
        };
        break;
    }
  } else {
    switch (type) {
      case "buttonElement":
        baseConfig = {
          ...configCreators.freeDraggableElement(
            configs.freeDraggableElement.properties
          ),
          ...configCreators.buttonElement(
            configs.freeDraggableElement.subtypes.buttonElement.properties,
            elementType
          ),
        };
        break;
      case "image":
        baseConfig = {
          ...configCreators.freeDraggableElement(
            configs.freeDraggableElement.properties
          ),
          ...configCreators.image(
            configs.freeDraggableElement.subtypes.image.properties,
            elementType
          ),
        };
        break;
      case "text":
        baseConfig = {
          ...configCreators.freeDraggableElement(
            configs.freeDraggableElement.properties
          ),
          ...configCreators.text(
            configs.freeDraggableElement.subtypes.text.properties,
            elementType
          ),
        };
        break;
      default:
        baseConfig = configCreators.freeDraggableElement(
          configs.freeDraggableElement.properties
        );
        break;
    }
  }
  return {
    ...(baseConfig.properties || {}),
    ...(baseConfig.children && { children: baseConfig.children }),
    ...baseConfig,
  };
}
