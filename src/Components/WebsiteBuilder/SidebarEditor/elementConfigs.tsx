import {
  CustomInputProps,
  ElementTypeConfigs,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import BoxModelEditor from "./BoxModelEditor";

export const elementConfigs: ElementTypeConfigs = {
  layout: {
    type: "layout",
    label: "佈局",
    properties: {
      size: {
        label: "大小",
        type: "composite",
        defaultValue: { width: 100, height: 100 },
        compositeFields: {
          width: {
            type: "number",
            transform: Number,
            defaultValue: 100,
            unit: "%",
          },
          height: {
            type: "number",
            transform: Number,
            defaultValue: 100,
            unit: "px",
          },
        },
      },
      responsiveBehavior: {
        label: "響應行為",
        type: "select",
        options: ["scaleProportionally", "fitWidth", "fitHeight"],
        defaultValue: "scaleProportionally",
      },
      useMaxWidth: {
        label: "使用最大寬度",
        type: "checkbox",
        defaultValue: false,
      },
      padding: {
        label: "內邊距",
        type: "text",
        defaultValue: "0px",
        renderCustomInput: ({ id, value, onChange }) => (
          <BoxModelEditor value={value} onChange={onChange} label="Padding" />
        ),
      },
      margin: {
        label: "外邊距",
        type: "text",
        defaultValue: "0px",
        renderCustomInput: ({ id, value, onChange }) => (
          <BoxModelEditor value={value} onChange={onChange} label="Margin" />
        ),
      },
      backgroundColor: {
        label: "背景顏色",
        type: "color",
        defaultValue: "#ffffff",
      },
      backgroundOpacity: {
        label: "背景透明度",
        type: "number",
        transform: Number,
        defaultValue: 1,
        unit: "%",
      },
      media: {
        label: "媒體",
        type: "object",
        defaultValue: { type: "image", url: "" },
        properties: {
          type: {
            label: "媒體類型",
            type: "select",
            options: ["image", "video"],
            defaultValue: "image",
          },
          url: {
            label: "URL",
            type: "text",
            defaultValue: "",
          },
        },
      },
    },
  },
  freeDraggable: {
    type: "freeDraggable",
    label: "自由拖動",
    properties: {
      position: {
        label: "位置",
        type: "custom",
        defaultValue: { x: 0, y: 0 },
        renderCustomInput: ({ id, value, onChange }: CustomInputProps) => (
          <div>
            <input
              type="number"
              id={`${id}-x`}
              value={value.x}
              onChange={(e) =>
                onChange({ ...value, x: Number(e.target.value) })
              }
            />
            <input
              type="number"
              id={`${id}-y`}
              value={value.y}
              onChange={(e) =>
                onChange({ ...value, y: Number(e.target.value) })
              }
            />
          </div>
        ),
      },
      zIndex: {
        label: "層級索引",
        type: "number",
        transform: Number,
        defaultValue: 0,
      },
    },
  },
  form: {
    type: "form",
    label: "表單",
    properties: {
      fields: {
        label: "表單字段",
        type: "custom",
        defaultValue: [],
        renderCustomInput: ({ id, value, onChange }: CustomInputProps) => (
          // 這裡可以實現一個複雜的表單字段編輯器
          <div>表單字段編輯器（占位符）</div>
        ),
      },
      submitButton: {
        label: "提交按鈕文本",
        type: "text",
        defaultValue: "提交",
      },
    },
  },
  imageUpload: {
    type: "imageUpload",
    label: "圖片上傳",
    properties: {
      allowedTypes: {
        label: "允許的文件類型",
        type: "text",
        transform: (value: string) =>
          value.split(",").map((v: string) => v.trim()),
        defaultValue: "jpg,png,gif",
      },
      maxSize: {
        label: "最大文件大小 (KB)",
        type: "number",
        transform: Number,
        defaultValue: 1024,
      },
      cropOptions: {
        label: "裁剪選項",
        type: "custom",
        defaultValue: {},
        renderCustomInput: ({ id, value, onChange }: CustomInputProps) => (
          // 這裡可以實現一個圖片裁剪選項編輯器
          <div>裁剪選項編輯器（占位符）</div>
        ),
      },
    },
  },
};

// 辅助函数：格式化带单位的值
const formatValueWithUnit = (value: number, unit?: string): string => {
  return unit ? `${value}${unit}` : value.toString();
};

// 辅助函数：解析带单位的值
const parseValueWithUnit = (
  value: string
): { value: number; unit?: string } => {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (match) {
    return { value: parseFloat(match[1]), unit: match[2] || undefined };
  }
  return { value: 0 };
};
