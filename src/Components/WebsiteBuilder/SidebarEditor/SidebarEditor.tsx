"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useElementContext } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import {
  ButtonOption,
  CustomInputProps,
  LocalElementType,
  PropertyConfigWithComposite,
} from "@/src/Components/WebsiteBuilder/BuilderInterface/index";
import { elementConfigs } from "./elementConfigs";
import useCurrentValues from "./useCurrentValues";
import ButtonGroup from "./ButtonGroup";
import { getNestedValue } from "./getNestedValue";

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

  const currentValues = useCurrentValues(localElement);

  const handleChange = useCallback(
    (propertyPath: string, value: any) => {
      setLocalElement((prev) => {
        if (!prev) return null;

        // 創建 updatedElement 作為 prev 的淺拷貝
        const updatedElement = { ...prev };
        // 創建 updatedElement.config 作為 prev.config 的淺拷貝
        updatedElement.config = { ...updatedElement.config };

        // 將 propertyPath 分割成各個層級
        const pathParts = propertyPath.split(".");
        let current: any = updatedElement.config;

        // 遍歷 pathParts，更新對象中的嵌套屬性
        for (let i = 0; i < pathParts.length - 1; i++) {
          // 如果當前層級的屬性不存在，則創建一個空對象
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          // 確保當前層級的屬性是對象
          current[pathParts[i]] = { ...current[pathParts[i]] };
          // 移動到下一層級
          current = current[pathParts[i]];
        }

        // 在最後一層級設置新值
        current[pathParts[pathParts.length - 1]] = value;

        // 如果 propertyPath 只包含一層，且 updatedElement 上存在這個屬性，則更新頂層屬性
        if (
          pathParts.length === 1 &&
          updatedElement.hasOwnProperty(pathParts[0])
        ) {
          updatedElement[pathParts[0]] = value;
        }

        updateSelectedElement(prev.id, `config.${propertyPath}`, value);

        console.log("updatedElement :", updatedElement);
        return updatedElement;
      });
    },
    [updateSelectedElement]
  );

  const renderField = useCallback(
    (key: string, fieldConfig: PropertyConfigWithComposite) => {
      if (!currentValues) {
        console.warn("currentValues is null or undefined");
        return null;
      }

      if (!selectedElement) {
        return <div>No element selected or data not loaded</div>;
      }

      // 根據 key 從 currentValues 中獲取對應的值
      const value = currentValues[key];

      // console.log("renderField value :", value);

      switch (fieldConfig.type) {
        case "text":
        case "number":
          return (
            <div key={key}>
              <label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </label>
              <input
                id={`${selectedElement.id}-${key}`}
                type={fieldConfig.type}
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (fieldConfig.type === "number") {
                    const transformedValue =
                      newValue === ""
                        ? ""
                        : fieldConfig.transform
                        ? fieldConfig.transform(newValue)
                        : Number(newValue);
                    handleChange(`config.${key}`, transformedValue);
                  } else {
                    handleChange(
                      `config.${key}`,
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
        case "checkbox":
          return (
            <div key={key}>
              <label>
                <input
                  id={`${selectedElement.id}-${key}`}
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) =>
                    handleChange(`config.${key}`, e.target.checked)
                  }
                />
                {fieldConfig.label}
              </label>
            </div>
          );
        case "color":
          return (
            <div key={key}>
              <label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </label>
              <input
                id={`${selectedElement.id}-${key}`}
                type="color"
                value={value || ""}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          );
        case "composite":
          if (!fieldConfig.compositeFields) {
            return <p key={key}>No composite fields available</p>;
          }
          if (fieldConfig.renderCustomInput) {
            const inputValue =
              value !== undefined && value !== null
                ? value
                : fieldConfig.defaultValue;
            return (
              <div key={key}>
                <label htmlFor={`${selectedElement.id}-${key}`}>
                  {fieldConfig.label}
                </label>
                {fieldConfig.renderCustomInput({
                  id: `${selectedElement.id}-${key}`,
                  value: inputValue,
                  onChange: (newValue) => {
                    const processedValue =
                      newValue === undefined || newValue === null
                        ? fieldConfig.defaultValue
                        : newValue;
                    handleChange(`config.${key}`, processedValue);
                  },
                })}
              </div>
            );
          }

          return (
            <div key={key}>
              <label>{fieldConfig.label}</label>
              {Object.entries(fieldConfig.compositeFields).map(
                ([subKey, subConfig]) => {
                  const subValue = getNestedValue(
                    currentValues.config,
                    `${key}.${subKey}`
                  );
                  const defaultValue =
                    fieldConfig.defaultValue &&
                    typeof fieldConfig.defaultValue === "object"
                      ? fieldConfig.defaultValue[subKey]
                      : subConfig.defaultValue;

                  return (
                    <div key={`${key}.${subKey}`}>
                      <label htmlFor={`${selectedElement.id}-${key}-${subKey}`}>
                        {subConfig.label}
                      </label>
                      <input
                        id={`${selectedElement.id}-${key}-${subKey}`}
                        type={subConfig.type}
                        value={subValue ?? defaultValue}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const transformedValue = subConfig.transform
                            ? subConfig.transform(newValue)
                            : subConfig.type === "number"
                            ? Number(newValue)
                            : newValue;
                          handleChange(
                            `config.${key}.${subKey}`,
                            transformedValue
                          );
                        }}
                      />
                      {subConfig.unit && <span>{subConfig.unit}</span>}
                    </div>
                  );
                }
              )}
            </div>
          );
        case "object":
          if (!fieldConfig.properties) {
            return <p key={key}>No object properties available</p>;
          }
          return (
            <div key={key}>
              <label>{fieldConfig.label}</label>
              {Object.entries(fieldConfig.properties).map(
                ([subKey, subConfig]) =>
                  renderField(
                    `${key}.${subKey}`,
                    subConfig as PropertyConfigWithComposite
                  )
              )}
            </div>
          );
        case "buttonGroup":
          if (!fieldConfig.options || !Array.isArray(fieldConfig.options)) {
            return <p key={key}>No valid options available for button group</p>;
          }
          const buttonOptions: ButtonOption[] = fieldConfig.options.map(
            (option) =>
              typeof option === "string"
                ? { label: option, value: option }
                : option
          );
          return (
            <div key={key}>
              <label>{fieldConfig.label}</label>
              <ButtonGroup
                options={buttonOptions}
                value={value}
                onChange={(newValue) => handleChange(`config.${key}`, newValue)}
              />
            </div>
          );
        case "custom":
          if (fieldConfig.renderCustomInput) {
            return (
              <div key={key}>
                <label htmlFor={`${selectedElement.id}-${key}`}>
                  {fieldConfig.label}
                </label>
                {fieldConfig.renderCustomInput({
                  id: `${selectedElement.id}-${key}`,
                  value,
                  onChange: (newValue) =>
                    handleChange(`config.${key}`, newValue),
                } as CustomInputProps)}
              </div>
            );
          }
          return null;
        default:
          return null;
      }
    },
    [handleChange, currentValues, selectedElement]
  );

  const renderedContent = useMemo(() => {
    if (!selectedElement) {
      return <div>No element selected or data not loaded</div>;
    }

    const elementType = selectedElement.isLayout ? "layout" : "freeDraggable";
    const config = elementConfigs[elementType];

    if (!config) {
      console.error(`No configuration found for element type: ${elementType}`);
      return <div>Error: Invalid configuration</div>;
    }

    // 獲取當前選擇元素的子類型配置
    const subtypeConfig = config.subtypes?.[selectedElement.type];

    return (
      <>
        <h2>Edit {elementType}</h2>
        {/* 遍歷配置中的屬性並渲染相應的字段 */}
        {Object.entries(config.properties).map(([key, propertyConfig]) =>
          renderField(key, propertyConfig as PropertyConfigWithComposite)
        )}
        {/* 如果存在子類型配置，渲染特定屬性 */}
        {subtypeConfig && (
          <>
            <h3>Specific Properties</h3>
            {Object.entries(subtypeConfig.properties).map(
              ([key, propertyConfig]) =>
                renderField(key, propertyConfig as PropertyConfigWithComposite)
            )}
          </>
        )}
      </>
    );
  }, [selectedElement, renderField]);

  return renderedContent;
};

export default SidebarEditor;
