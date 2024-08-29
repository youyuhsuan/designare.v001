interface ElementConfig {
  [key: string]: any;
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

const createButtonElementConfig = (
  properties: any,
  elementType: string
): ElementConfig => ({
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
  border:
    properties.border.defaultValue[
      elementType as keyof typeof properties.border.defaultValue
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

const createFreeDraggableConfig = (properties: any): ElementConfig => ({
  horizontalAlignment: properties.horizontalAlignment.defaultValue,
  verticalAlignment: properties.verticalAlignment.defaultValue,
  position: properties.position.defaultValue,
});

const configCreators = {
  layout: createLayoutConfig,
  text: createTextConfig,
  image: createImageConfig,
  buttonElement: createButtonElementConfig,
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
  } else {
    if (type === "buttonElement") {
      return {
        ...configCreators.freeDraggable(configs.freeDraggable.properties),
        ...configCreators.buttonElement(
          configs.freeDraggable.subtypes.buttonElement.properties,
          elementType
        ),
      };
    }

    if (type === "image") {
      return {
        ...configCreators.freeDraggable(configs.freeDraggable.properties),
        ...configCreators.image(
          configs.freeDraggable.subtypes.image.properties,
          elementType
        ),
      };
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
}
