"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useElementContext } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import {
  CustomInputProps,
  LocalElementType,
  PropertyConfigWithComposite,
} from "@/src/Components/WebsiteBuilder/BuilderInterface/index";
import { elementConfigs } from "./elementConfigs";

const SidebarEditor: React.FC = () => {
  const { selectedElement, updateSelectedElement } = useElementContext();
  const [localElement, setLocalElement] = useState<LocalElementType | null>(
    null
  );

  useEffect(() => {
    if (selectedElement) {
      setLocalElement(selectedElement);
    }
  }, [selectedElement]);

  const currentValues = useMemo(() => {
    if (!localElement) return null;

    const elementType = localElement.isLayout ? "layout" : "freeDraggable";
    const typeConfig = elementConfigs[elementType];

    return Object.entries(typeConfig.properties).reduce(
      (acc, [key, config]) => {
        acc[key] = localElement.config?.[key] ?? config.defaultValue;
        return acc;
      },
      {} as Record<string, any>
    );
  }, [localElement]);

  const handleChange = useCallback(
    (propertyPath: string, value: any) => {
      setLocalElement((prev) => {
        if (!prev) return null;

        const updatedElement = { ...prev };
        updatedElement.config = { ...updatedElement.config };

        const pathParts = propertyPath.split(".");
        let current: any = updatedElement.config;

        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          current = current[pathParts[i]];
        }
        current[pathParts[pathParts.length - 1]] = value;

        updateSelectedElement(prev.id, `config.${propertyPath}`, value);
        console.log("updatedElement", updatedElement);
        return updatedElement;
      });
    },
    [updateSelectedElement]
  );

  const renderField = useCallback(
    (
      key: string,
      fieldConfig: PropertyConfigWithComposite,
      parentKey: string = ""
    ) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      const value = currentValues
        ? getNestedValue(currentValues, fullKey)
        : fieldConfig.defaultValue;

      if (!selectedElement) {
        return <div>No element selected or data not loaded</div>;
      }
      switch (fieldConfig.type) {
        case "text":
        case "number":
          return (
            <div key={fullKey}>
              <label htmlFor={`${selectedElement.id}-${fullKey}`}>
                {fieldConfig.label}
              </label>
              <input
                id={`${selectedElement.id}-${fullKey}`}
                type={fieldConfig.type}
                value={value === null || value === undefined ? "" : value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (fieldConfig.type === "number") {
                    const transformedValue =
                      newValue === ""
                        ? ""
                        : fieldConfig.transform
                        ? fieldConfig.transform(newValue)
                        : Number(newValue);
                    handleChange(fullKey, transformedValue);
                  } else {
                    handleChange(
                      fullKey,
                      fieldConfig.transform
                        ? fieldConfig.transform(newValue)
                        : newValue
                    );
                  }
                }}
              />
              {fieldConfig.unit && <span>{fieldConfig.unit}</span>}
            </div>
          );
        case "select":
          return (
            <div key={fullKey}>
              <label htmlFor={`${selectedElement.id}-${fullKey}`}>
                {fieldConfig.label}
              </label>
              <select
                id={`${selectedElement.id}-${fullKey}`}
                value={value}
                onChange={(e) => handleChange(fullKey, e.target.value)}
              >
                {fieldConfig.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        case "checkbox":
          return (
            <div key={fullKey}>
              <label>
                <input
                  id={`${selectedElement.id}-${fullKey}`}
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => handleChange(fullKey, e.target.checked)}
                />
                {fieldConfig.label}
              </label>
            </div>
          );

        case "color":
          return (
            <div key={fullKey}>
              <label htmlFor={`${selectedElement.id}-${fullKey}`}>
                {fieldConfig.label}
              </label>
              <input
                id={`${selectedElement.id}-${fullKey}`}
                type="color"
                value={value || ""}
                onChange={(e) => handleChange(fullKey, e.target.value)}
              />
            </div>
          );

        case "composite":
          if (!fieldConfig.compositeFields) {
            return <p key={fullKey}>No composite fields available</p>;
          }

          if (fieldConfig.renderCustomInput) {
            const inputValue =
              value !== undefined && value !== null
                ? value
                : fieldConfig.defaultValue;

            return (
              <div key={fullKey}>
                <label htmlFor={`${selectedElement.id}-${fullKey}`}>
                  {fieldConfig.label}
                </label>
                {fieldConfig.renderCustomInput({
                  id: `${selectedElement.id}-${fullKey}`,
                  value: inputValue,
                  onChange: (newValue) => {
                    const processedValue =
                      newValue === undefined || newValue === null
                        ? fieldConfig.defaultValue
                        : newValue;
                    handleChange(fullKey, processedValue);
                  },
                })}
              </div>
            );
          }

          return (
            <div key={fullKey}>
              <label>{fieldConfig.label}</label>
              {Object.entries(fieldConfig.compositeFields).map(
                ([subKey, subConfig]) =>
                  renderField(
                    subKey,
                    subConfig as PropertyConfigWithComposite,
                    fullKey
                  )
              )}
            </div>
          );
        case "object":
          if (!fieldConfig.properties) {
            return <p key={fullKey}>No object properties available</p>;
          }
          return (
            <div key={fullKey}>
              <label>{fieldConfig.label}</label>
              {Object.entries(fieldConfig.properties).map(
                ([subKey, subConfig]) =>
                  renderField(
                    subKey,
                    subConfig as PropertyConfigWithComposite,
                    fullKey
                  )
              )}
            </div>
          );

        case "custom":
          if (fieldConfig.renderCustomInput) {
            return (
              <div key={fullKey}>
                <label htmlFor={`${selectedElement.id}-${fullKey}`}>
                  {fieldConfig.label}
                </label>
                {fieldConfig.renderCustomInput({
                  id: `${selectedElement.id}-${fullKey}`,
                  value,
                  onChange: (newValue) => handleChange(fullKey, newValue),
                } as CustomInputProps)}
              </div>
            );
          }
          return null;

        default:
          return null;
      }
    },
    [currentValues, handleChange, selectedElement]
  );

  if (!selectedElement || !currentValues) {
    return <div>No element selected or data not loaded</div>;
  }

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const elementType = selectedElement.isLayout ? "layout" : "freeDraggable";
  const config = elementConfigs[elementType];

  return (
    <>
      <h2>Edit {elementType}</h2>
      {Object.entries(config.properties).map(([key, propertyConfig]) =>
        renderField(key, propertyConfig as PropertyConfigWithComposite)
      )}
    </>
  );
};

export default SidebarEditor;
