import { useMemo } from "react";
import { LocalElementType } from "../BuilderInterface";
import { elementConfigs } from "./elementConfigs";

type CurrentValuesType = Record<string, any>;

const useCurrentValues = (
  localElement: LocalElementType | null
): CurrentValuesType | null => {
  return useMemo(() => {
    if (!localElement || !localElement.config) {
      console.warn(
        "useCurrentValues: localElement or localElement.config is null"
      );
      return null;
    }

    try {
      const elementType = localElement.isLayout ? "layout" : "freeDraggable";
      const typeConfig = elementConfigs[elementType];

      if (!typeConfig) {
        throw new Error(
          `No configuration found for element type: ${elementType}`
        );
      }

      const getDefaultValue = (config: any) => {
        if (
          config.type === "buttonGroup" &&
          config.options &&
          config.options.length > 0
        ) {
          return config.options[0].value;
        }
        return config.defaultValue;
      };

      const getProperties = (
        properties: Record<string, any>,
        sourceObj: any
      ): CurrentValuesType => {
        return Object.entries(properties).reduce((acc, [key, config]) => {
          if (config.type === "composite" && config.compositeFields) {
            acc[key] = getProperties(
              config.compositeFields,
              sourceObj[key] || {}
            );
          } else {
            const defaultValue = getDefaultValue(config);
            acc[key] =
              sourceObj[key] !== undefined ? sourceObj[key] : defaultValue;
          }
          console.log(`Setting ${key}:`, acc[key]);
          return acc;
        }, {} as CurrentValuesType);
      };

      // 獲取所有屬性（包括常見屬性和子類型屬性）
      const allProperties = {
        ...typeConfig.properties,
        ...(typeConfig.subtypes &&
        localElement.type &&
        typeConfig.subtypes[localElement.type]
          ? typeConfig.subtypes[localElement.type].properties
          : {}),
      };

      // 僅從 localElement.config 獲取當前值
      const result = getProperties(allProperties, localElement.config);

      console.log("最終結果:", result);
      return result;
    } catch (error) {
      console.error("計算 currentValues 時出錯:", error);
      return null;
    }
  }, [localElement]);
};

export default useCurrentValues;
