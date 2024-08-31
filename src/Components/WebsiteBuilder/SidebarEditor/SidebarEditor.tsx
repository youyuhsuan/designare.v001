"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import {
  LocalElementType,
  PropertyConfigWithComposite,
} from "@/src/Components/WebsiteBuilder/BuilderInterface/index";

import { elementConfigs } from "./elementConfigs";
import { getNestedValue } from "./getNestedValue";

// UI
import ButtonGroup from "./ButtonGroup";
import BoxModelEditor from "./BoxModelEditor";
import ColorPicker from "./ColorPicker";
import CustomSelect from "./CustomSelect";
import MediaUploader from "./MediaUploader";

// Redux
import { useAppDispatch } from "@/src/libs/hook";
import { updateElementInstance } from "@/src/libs/features/websiteBuilder/elementLibrarySlice";

// Usecontext
import { useElementContext } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import { createNestedObject } from "@/src/utilities/createNestedObject";

const EditorContainer = styled.div`
  z-index: 10;
  width: 15rem; //  240px
  box-shadow: ${(props) => props.theme.colors.shadow} -4px 9px 25px -6px;
  background-color: ${(props) => props.theme.colors.background};
  border-left: 1px solid ${(props) => props.theme.colors.border};
  overflow-y: auto;
  padding: 1rem;
`;

const CompositeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 1rem;
`;

const EditorWrapper = styled.div`
  margin-bottom: 1rem;
  flex: 1;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.colors.border};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.375rem;
  background-color: ${(props) => props.theme.colors.background};
  box-shadow: 0 1px 2px ${(props) => props.theme.colors.shadow};
  &:focus {
    border-color: ${(props) => props.theme.colors.accent};
    outline: none;
    box-shadow: 0 0 0 1px ${(props) => props.theme.colors.accent};
  }
`;

const SubConfig = styled.span`
  color: ${(props) => props.theme.colors.border};
`;

const SidebarEditor: React.FC = () => {
  const dispatch = useAppDispatch();

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

        const updatedElement = { ...prev };
        updatedElement.config = { ...updatedElement.config };

        // 将 propertyPath 分割成各个层级
        const pathParts = propertyPath.split(".");
        let current: any = updatedElement.config;

        console.log("Initial current (config):", current);
        console.log("Path parts:", pathParts);

        // 遍历 pathParts，更新对象中的嵌套属性
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          console.log(`Processing part: ${part}`);

          // 如果当前层级的属性不存在，则创建一个空对象
          if (!current[part]) {
            console.log(`Creating new object at: ${part}`);
            current[part] = {};
          }

          // 确保当前层级的属性是对象
          current[part] = { ...current[part] };
          // 移动到下一层级
          current = current[part];
        }

        const lastKey = pathParts[pathParts.length - 1];
        console.log("Last key:", lastKey);

        // 处理数组更新
        if (Array.isArray(current[lastKey])) {
          // 如果 value 是单个值，假设它是要更新数组中的某个索引
          if (!Array.isArray(value)) {
            const index = parseInt(lastKey);
            if (
              !isNaN(index) &&
              index >= 0 &&
              index < current[lastKey].length
            ) {
              console.log(
                `Updating array at index ${index} with value:`,
                value
              );
              current[lastKey][index] = value;
            }
          } else {
            // 如果 value 是数组，直接替换整个数组
            console.log(`Replacing array with value:`, value);
            current[lastKey] = value;
          }
        } else {
          // 对于非数组类型，直接设置新值
          console.log(`Setting value at ${lastKey}:`, value);
          current[lastKey] = value;
        }

        // 在最后一层级设置新值
        current[pathParts[pathParts.length - 1]] = value;

        // 如果 propertyPath 只包含一层，且 updatedElement 上存在这个属性，则更新顶层属性
        if (
          pathParts.length === 1 &&
          updatedElement.hasOwnProperty(pathParts[0])
        ) {
          console.log(
            `Updating top-level property ${pathParts[0]} with value:`,
            value
          );
          updatedElement[pathParts[0]] = value;
        }

        // 调用 updateSelectedElement
        updateSelectedElement(prev.id, `config.${propertyPath}`, value);

        console.log("Updated updatedElement:", updatedElement);
        console.log("Property path:", propertyPath, "Value:", value);

        const updates = createNestedObject(["config", ...pathParts], value);

        // 构造并发送 Redux action
        dispatch(
          updateElementInstance({
            id: prev.id,
            updates: updates,
          })
        );

        return updatedElement;
      });
    },
    [dispatch, updateSelectedElement]
  );

  const handleButtonGroupChange = useCallback(
    (key: string, newValue: any) => {
      handleChange(`${key}`, newValue);
    },
    [handleChange]
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
              <InputWrapper>
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
                {fieldConfig.unit && <SubConfig>{fieldConfig.unit}</SubConfig>}
              </InputWrapper>
            </EditorWrapper>
          );
        case "select":
          return (
            <EditorWrapper key={key}>
              <Label htmlFor={`${selectedElement.id}-${key}`}>
                {fieldConfig.label}
              </Label>
              <InputWrapper>
                <CustomSelect
                  id={`${selectedElement.id}-${key}`}
                  options={fieldConfig.options as string[]}
                  value={value ?? fieldConfig.defaultValue}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const newValue = e.target.value;
                    handleChange(
                      key,
                      fieldConfig.transform
                        ? fieldConfig.transform(newValue)
                        : newValue
                    );
                  }}
                />
                {fieldConfig.unit && <SubConfig>{fieldConfig.unit}</SubConfig>}
              </InputWrapper>
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
              <CompositeContainer>
                {Object.entries(fieldConfig.compositeFields).map(
                  ([subKey, subConfig]) => {
                    const fullPath = `${key}.${subKey}`;
                    let subValue = getNestedValue(
                      currentValues.config,
                      fullPath
                    );

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
                        <InputWrapper>
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
                          {subConfig.unit && (
                            <SubConfig>{subConfig.unit}</SubConfig>
                          )}
                        </InputWrapper>
                      </EditorWrapper>
                    );
                  }
                )}
              </CompositeContainer>
            </EditorWrapper>
          );
        case "mediaUpload":
          return (
            <EditorWrapper key={key}>
              <Label>{fieldConfig.label}</Label>
              <MediaUploader
                value={value}
                onChange={(newValue) => handleChange(`${key}`, newValue)}
                accept={fieldConfig.accept as string}
                maxSize={fieldConfig.maxSize as number}
              />
            </EditorWrapper>
          );
        case "buttonGroup":
          if (!fieldConfig.options || !Array.isArray(fieldConfig.options)) {
            return <p key={key}>No valid options available for button group</p>;
          }
          return (
            <ButtonGroup
              key={key}
              options={fieldConfig.options}
              value={value}
              onChange={(newValue) => handleButtonGroupChange(key, newValue)}
              groupKey={key}
              label={fieldConfig.label as string}
            />
          );
        default:
          return null;
      }
    },
    [selectedElement, currentValues, handleChange, handleButtonGroupChange]
  );

  const renderedContent = useMemo(() => {
    if (!selectedElement) {
      return <div>No element selected or data not loaded</div>;
    }

    const elementType = selectedElement.isLayout
      ? "layoutElement"
      : "freeDraggableElement";
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
        {Object.entries(config.properties).map(([key, propertyConfig]) =>
          renderField(key, propertyConfig as PropertyConfigWithComposite)
        )}
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
