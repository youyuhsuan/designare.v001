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
import ButtonGroup from "./ButtonGroup";
import { getNestedValue } from "./getNestedValue";
import { ColorPicker } from "./ColorPicker";

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
    return {
      ...localElement,
      config: { ...localElement.config },
    };
  }, [localElement]);

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

        const lastKey = pathParts[pathParts.length - 1];

        // 處理數組更新
        if (Array.isArray(current[lastKey])) {
          // 如果 value 是單個值，假設它是要更新數組中的某個索引
          if (!Array.isArray(value)) {
            const index = parseInt(lastKey);
            if (!isNaN(index) && index >= 0 && index < current.length) {
              current[index] = value;
            }
          } else {
            // 如果 value 是數組，直接替換整個數組
            current[lastKey] = value;
          }
        } else {
          // 對於非數組類型，直接設置新值
          current[lastKey] = value;
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
      if (!selectedElement) {
        return <div>No element selected or data not loaded</div>;
      }

      if (!currentValues) {
        console.warn("currentValues is null or undefined");
        return null;
      }

      const value = key.includes(".")
        ? getNestedValue(currentValues.config, key)
        : currentValues.config[key];

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
                value={value ?? ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (fieldConfig.type === "number") {
                    const transformedValue =
                      newValue === ""
                        ? ""
                        : fieldConfig.transform
                        ? fieldConfig.transform(newValue)
                        : Number(newValue);
                    handleChange(key, transformedValue);
                  } else {
                    handleChange(
                      key,
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
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
                {fieldConfig.label}
              </label>
            </div>
          );
        case "color":
          let colorValue = fieldConfig.defaultColor;
          let opacityValue = fieldConfig.defaultOpacity;
          if (value) {
            if (typeof value === "string") {
              colorValue = value;
              const rgba = value.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/
              );
              if (rgba) {
                const parsedAlpha =
                  rgba[4] !== undefined ? parseFloat(rgba[4]) : 1;
                const alpha = !isNaN(parsedAlpha) ? parsedAlpha : 1;
                opacityValue = Math.round(alpha * 100);
              }
            } else if (typeof value === "object" && value.color) {
              colorValue = value.color;
              opacityValue =
                value.opacity !== undefined
                  ? value.opacity
                  : fieldConfig.defaultOpacity;
            }
          }

          console.log("colorValue", colorValue);
          console.log("opacityValue", opacityValue);

          return (
            <div key={key}>
              <label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </label>
              <ColorPicker
                id={`${selectedElement.id}-${key}`}
                color={colorValue}
                opacity={opacityValue}
                defaultColor={fieldConfig.defaultColor}
                defaultOpacity={fieldConfig.defaultOpacity}
                onChange={(newColor: string, newOpacity: number) => {
                  handleChange(key, newColor);
                  handleChange(`${key}Opacity`, newOpacity);
                }}
              />
            </div>
          );
        case "slider":
          return (
            <div key={key}>
              <label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </label>
              <input
                id={`${selectedElement.id}-${key}`}
                type="range"
                min={fieldConfig.min || 0}
                max={fieldConfig.max || 100}
                step={fieldConfig.step || 1}
                value={value || 0}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  handleChange(key, newValue);
                }}
              />
              <span>
                {value || 0}
                {fieldConfig.unit}
              </span>
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
                    handleChange(`${key}`, processedValue);
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
                  const fullPath = `${key}.${subKey}`;
                  let subValue = getNestedValue(currentValues.config, fullPath);

                  // 如果 subValue 是 undefined，使用默認值
                  if (subValue === undefined) {
                    subValue =
                      fieldConfig.defaultValue &&
                      typeof fieldConfig.defaultValue === "object"
                        ? fieldConfig.defaultValue[subKey]
                        : subConfig.defaultValue;
                  }

                  console.log(
                    `Composite subfield: ${fullPath}, value:`,
                    subValue
                  );

                  return (
                    <div key={fullPath}>
                      <label htmlFor={`${selectedElement.id}-${fullPath}`}>
                        {subConfig.label}
                      </label>
                      <input
                        id={`${selectedElement.id}-${fullPath}`}
                        type={subConfig.type}
                        value={subValue ?? ""}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          let transformedValue: number | string = newValue;

                          if (subConfig.type === "number") {
                            transformedValue =
                              newValue === "" ? 0 : Number(newValue);
                          }

                          if (
                            subConfig.transform &&
                            transformedValue !== null
                          ) {
                            transformedValue =
                              subConfig.transform(transformedValue);
                          }

                          console.log(
                            `Updating ${fullPath} to:`,
                            transformedValue
                          );
                          handleChange(fullPath, transformedValue);
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
