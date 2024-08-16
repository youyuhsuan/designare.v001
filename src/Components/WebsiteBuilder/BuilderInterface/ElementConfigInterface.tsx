type ElementType = "layout" | "freeDraggable";
type PropertyType =
  | "text"
  | "number"
  | "checkbox"
  | "select"
  | "color"
  | "custom"
  | "object"
  | "button"
  | "composite";

interface FontTypeOption {
  value: string;
  label: string;
  size: number;
  unit: string;
}
export interface PropertyConfig {
  label?: string; // 屬性的顯示名稱
  type: PropertyType;
  options?:
    | Array<{ value: string; label: string }>
    | Record<
        string,
        { label: string; type: string; transform?: (value: any) => any }
      >
    | string[]
    | FontTypeOption[];
  subtypes?: {
    [key: string]: ElementConfig;
  };

  properties?: Record<string, PropertyConfig>; // 用於 object 類型的嵌套屬性
  compositeFields?: Record<string, Omit<PropertyConfig, "compositeFields">>;
  defaultValue?: any; // 屬性的默認值
  unit?: string; // 單位
  min?: number;
  max?: number;
  validate?: Function;
  x?: number;
  y?: number;
  transform?: (value: any) => any; // 用於轉換輸入值的函數
  renderCustomInput?: (props: CustomInputProps) => React.ReactNode; // 自定義輸入組件的渲染函數
  condition?: (values: Record<string, any>) => boolean; // 新增的 condition 属性
}

export type PropertyConfigWithComposite = PropertyConfig & {
  label?: string;
  compositeFields?: Record<string, Omit<PropertyConfig, "compositeFields">>;
};

export interface CustomInputProps {
  id: string;
  value: any;
  onChange: (value: any) => void;
}

// 元素配置接口
export interface ElementConfig {
  type: string; // 元素類型的標識符
  label: string; // 元素的顯示標籤
  properties: Record<string, PropertyConfig>; // 元素的屬性配置
  [key: string]: any; // 这将允许你使用字符串索引任何额外的属性
}

// 定义顶层元素配置接口
export interface TopLevelElementConfig extends ElementConfig {
  subtypes?: Record<string, ElementConfig>;
}

// 定义完整的元素配置类型
export type ElementConfigs = {
  [key in ElementType]: TopLevelElementConfig;
};
