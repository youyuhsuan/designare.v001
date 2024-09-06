import React from "react";
import FirebaseImage from "@/src/Components/FirebaseImage";

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
        width: `${config.size.width || 300}px`,
        height: `${config.size.height || 300}px`,
        position: "absolute" as const,
        left: `${config.position?.x || 0}px`,
        top: `${config.position?.y || 0}px`,
        objectFit: config.objectFit,
        border: config.border,
        borderRadius: `${config.borderRadius}%`,
        overflow: "hidden",
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
      tagName = "img";
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
    return (
      <FirebaseImage
        id={id}
        src={config.media.url || content}
        style={style}
        alt={config.alt || ""}
      />
    );
  }

  return React.createElement(tagName, { key: id, style }, content);
}
