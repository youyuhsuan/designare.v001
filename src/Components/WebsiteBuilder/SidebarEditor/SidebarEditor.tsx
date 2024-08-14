"use client";

import React from "react";
import { useElementContext } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import {
  CustomInputProps,
  PropertyConfigWithComposite,
} from "../BuilderInterface";
import { elementConfigs } from "./elementConfigs";
import { useDispatch, useSelector } from "react-redux";
import { selectElementInstanceById } from "@/src/libs/features/websiteBuilder/websiteBuliderSelector";
import { updateElementInstance } from "@/src/libs/features/websiteBuilder/websiteBuilderSlice";
import { RootState } from "@/src/libs/store";

const SidebarEditor: React.FC = () => {
  const { selectedElement } = useElementContext();
  const dispatch = useDispatch();

  const elementData = useSelector((state: RootState) =>
    selectedElement
      ? selectElementInstanceById(selectedElement.id)(state)
      : null
  );

  if (!selectedElement) {
    return <div>No element selected</div>;
  }

  const elementType = selectedElement.isLayout ? "layout" : "freeDraggable";
  const config = elementConfigs[elementType];

  const handleChange = (key: string, value: any) => {
    dispatch(
      updateElementInstance({
        id: selectedElement.id,
        updates: { [key]: value },
      })
    );
  };

  const renderField = (
    key: string,
    fieldConfig: PropertyConfigWithComposite,
    parentKey: string = ""
  ) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const value = parentKey
      ? getNestedValue(elementData, fullKey) ?? fieldConfig.defaultValue
      : elementData?.[key] ?? fieldConfig.defaultValue;

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
              value={value}
              onChange={(e) =>
                handleChange(
                  fullKey,
                  fieldConfig.transform
                    ? fieldConfig.transform(e.target.value)
                    : e.target.value
                )
              }
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
        return (
          <div key={fullKey}>
            <label>{fieldConfig.label}</label>
            {Object.entries(fieldConfig.compositeFields).map(
              ([subKey, subConfig]) => (
                <div key={`${fullKey}-${subKey}`}>
                  <label htmlFor={`${selectedElement.id}-${fullKey}-${subKey}`}>
                    {subKey}
                  </label>
                  <input
                    id={`${selectedElement.id}-${fullKey}-${subKey}`}
                    type={subConfig.type}
                    value={value && value[subKey] ? value[subKey] : ""}
                    onChange={(e) =>
                      handleChange(fullKey, {
                        ...value,
                        [subKey]: subConfig.transform
                          ? subConfig.transform(e.target.value)
                          : e.target.value,
                      })
                    }
                  />
                  {subConfig.unit && <span>{subConfig.unit}</span>}
                </div>
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
            {Object.entries(fieldConfig.properties).map(([subKey, subConfig]) =>
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
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

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
