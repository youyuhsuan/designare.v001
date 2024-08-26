type ElementType = "layout" | "freeDraggable";
type PropertyType =
  | "text"
  | "number"
  | "checkbox"
  | "select"
  | "color"
  | "custom"
  | "slider"
  | "mediaUpload"
  | "button"
  | "buttonGroup"
  | "boxModel"
  | "composite";

interface BaseOption {
  label: string;
  value: any;
}

export interface FontTypeOption extends BaseOption {
  size: number;
  unit: string;
}

export interface ButtonOption extends BaseOption {
  icon?: string;
}

export interface CustomOption extends BaseOption {
  transform?: (value: any) => any;
}

export interface IconOption extends BaseOption {
  icon: string;
}

export type OptionType =
  | string
  | FontTypeOption
  | ButtonOption
  | CustomOption
  | IconOption
  | BaseOption;

export interface PropertyConfig {
  label?: string; // 屬性的顯示名稱
  type: PropertyType;
  options?: OptionType | OptionType[]; // Allow for single option or array of options
  subtypes?: {
    [key: string]: ElementConfig;
  };

  defaultValue?: ((elementType: string) => any) | any | null;
  defaultColor?: ((elementType: string) => any) | any | null;
  defaultOpacity?: ((elementType: string) => any) | any | null;

  unit?: string; // 單位
  step?: number;
  min?: number;
  max?: number;

  accept?: string;
  maxSize?: number;

  properties?: Record<string, PropertyConfig>; //  object 嵌套屬性
  compositeFields?: Record<string, Omit<PropertyConfig, "compositeFields">>;
  multiple?: boolean; //  buttonGroup 類型

  validate?: Function; //  認證
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

export interface ElementConfig {
  type: string; // 元素類型的標識符
  label: string; // 元素的顯示標籤
  properties: Record<string, PropertyConfig>; // 元素的屬性配置
  [key: string]: any; // 这将允许你使用字符串索引任何额外的属性
}

export interface TopLevelElementConfig extends ElementConfig {
  subtypes?: Record<string, ElementConfig>;
}

export type ElementConfigs = {
  [key in ElementType]: TopLevelElementConfig;
};

export interface ButtonGroupProps {
  options: ButtonOption[];
  value: string;
  isAlignment: boolean;
  onChange: (value: string) => void;
  groupKey: string;
}
