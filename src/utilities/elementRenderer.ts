import React from "react";

export function renderElement(element: any) {
  const { id, type, content, config, elementType } = element;

  const commonStyle = {
    width: `${config.size?.width || "auto"}`,
    height: `${config.size?.height || "auto"}`,
  };

  let specificStyle = {};
  switch (type) {
    case "layout":
    case "sidebarLayout":
    case "columnizedLayout":
    case "gridLayout":
      specificStyle = {
        gap: config.gap,
        padding: config.boxModelEditor?.padding,
        margin: config.boxModelEditor?.margin,
        media: config.media,
        backgroundColor: config.backgroundColor?.defaultColor,
        opacity: config.backgroundColor?.defaultOpacity,
      };
      break;
    case "buttonElement":
      specificStyle = {
        position: "absolute" as const,
        left: `${config.position?.x || 0}px`,
        top: `${config.position?.y || 0}px`,
        fontSize: `${config.fontSize}px`,
        color: config.textColor,
        fontFamily: config.fontFamily,
        backgroundColor: config.backgroundColor,
        border: config.border,
        borderRadius: `${config.borderRadius}px`,
        padding: config.boxModelEditor?.padding,
        margin: config.boxModelEditor?.margin,
      };
      break;
    case "image":
      specificStyle = {
        position: "absolute" as const,
        left: `${config.position?.x || 0}px`,
        top: `${config.position?.y || 0}px`,
        objectFit: config.objectFit,
        border: config.border,
        borderRadius: `${config.borderRadius}%`,
      };
      break;
    case "text":
      specificStyle = {
        position: "absolute" as const,
        left: `${config.position?.x || 0}px`,
        top: `${config.position?.y || 0}px`,
        fontSize: `${config.fontSize}px`,
        color: config.textColor,
        letterSpacing: `${config.letterSpacing}px`,
        lineHeight: config.lineHeight,
        fontFamily: config.fontFamily,
        fontWeight: config.fontWeight,
        textDecoration: config.textDecoration,
      };
      break;
  }

  const style = { ...commonStyle, ...specificStyle };

  let tagName: string;
  switch (type) {
    case "text":
      tagName = elementType || "p";
      break;
    case "image":
      tagName = "Image";
      break;
    case "button":
    case "buttonElement":
      tagName = "button";
      break;
    case "layout":
    case "layoutElement":
    case "sidebarLayout":
    case "columnizedLayout":
    case "gridLayout":
      tagName = "div";
      break;
    default:
      tagName = "div";
  }

  if (type === "image") {
    return React.createElement(tagName, {
      key: id,
      style,
      src: content,
      alt: config.alt || "",
    });
  }
  return React.createElement(tagName, { key: id, style }, content);
}
