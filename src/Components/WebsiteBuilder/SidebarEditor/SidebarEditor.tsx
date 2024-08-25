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
import styled from "styled-components";
import BoxModelEditor from "./BoxModelEditor";

const EditorContainer = styled.div`
  z-index: 10;
  width: 15rem; //  240px
  box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;
  background-color: ${(props) => props.theme.colors.background};
  border-left: 1px solid ${(props) => props.theme.colors.border};
  overflow-y: auto;
  padding: 16px;
`;

const EditorWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.border};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.375rem;
  background-color: ${(props) => props.theme.colors.background};
  background-color: ${(props) => props.theme.colors.text};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  &:focus {
    border-color: ${(props) => props.theme.colors.accent};
    outline: none;
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.accent};
  }
`;

const Span = styled.span`
  margin-left: 0.5rem;
  color: ${(props) => props.theme.colors.border};
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  background: ${(props) => props.theme.colors.background};
  height: 0.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.accent};
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.accent};
    cursor: pointer;
  }
`;

const CompositeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CompositeField = styled.div`
  margin-bottom: 1rem;
`;

const ObjectContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SidebarEditor: React.FC = () => {
  // 從 useElementContext 中取得選中的元素以及更新選中元素的函數
  const { selectedElement, updateSelectedElement } = useElementContext();
  // 使用 localElement 儲存選中的元素狀態
  const [localElement, setLocalElement] = useState<LocalElementType | null>(
    null
  );

  useEffect(() => {
    if (selectedElement) {
      setLocalElement(selectedElement);
    }
  }, [selectedElement]);

  // 使用 useMemo 來計算 currentValues，避免不必要的重新計算
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
            <EditorWrapper key={key}>
              <Label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </Label>
              <Input
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
            </EditorWrapper>
          );
        case "checkbox":
          return (
            <EditorWrapper key={key}>
              <Label>
                <Input
                  id={`${selectedElement.id}-${key}`}
                  type="checkbox"
                  checked={!!value}
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
                {fieldConfig.label}
              </Label>
            </EditorWrapper>
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
          return (
            <EditorWrapper key={key}>
              <Label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </Label>
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
            </EditorWrapper>
          );
        case "slider":
          return (
            <EditorWrapper key={key}>
              <Label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </Label>
              <Input
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
            </EditorWrapper>
          );
        case "boxModel":
          const boxModelValue = value || fieldConfig.defaultValue;
          return (
            <EditorWrapper key={key}>
              <Label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </Label>
              <BoxModelEditor
                value={boxModelValue}
                onChange={(newValue) => {
                  const processedValue =
                    newValue === undefined || newValue === null
                      ? fieldConfig.defaultValue
                      : newValue;
                  handleChange(key, processedValue);
                }}
              />
            </EditorWrapper>
          );

        case "composite":
          if (!fieldConfig.compositeFields) {
            return <p key={key}>No composite fields available</p>;
          }
          return (
            <EditorWrapper key={key}>
              <Label>{fieldConfig.label}</Label>
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
                    <EditorWrapper key={fullPath}>
                      <Label htmlFor={`${selectedElement.id}-${fullPath}`}>
                        {subConfig.label}
                      </Label>
                      <Input
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
                    </EditorWrapper>
                  );
                }
              )}
            </EditorWrapper>
          );
        case "object":
          if (!fieldConfig.properties) {
            return <p key={key}>No object properties available</p>;
          }
          return (
            <EditorWrapper key={key}>
              <Label>{fieldConfig.label}</Label>
              {Object.entries(fieldConfig.properties).map(
                ([subKey, subConfig]) =>
                  renderField(
                    `${key}.${subKey}`,
                    subConfig as PropertyConfigWithComposite
                  )
              )}
            </EditorWrapper>
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

  return <EditorContainer>{renderedContent}</EditorContainer>;
};

export default SidebarEditor;
