import { ElementConfigs } from "@/src/Components/WebsiteBuilder/BuilderInterface/index";
import BoxModelEditor from "@/src/Components/WebsiteBuilder/SidebarEditor/BoxModelEditor";
import { textDefaults } from "@/src/Components/WebsiteBuilder/ElementDefaults/index";

export const elementConfigs: ElementConfigs = {
  layout: {
    type: "layout",
    label: "佈局",
    properties: {
      size: {
        label: "大小",
        type: "composite",
        transform: Number,
        defaultValue: { width: 1200, height: 100 },
        compositeFields: {
          width: {
            label: "寬度",
            type: "number",
            transform: Number,
            defaultValue: 1200,
            unit: "px",
          },
          height: {
            label: "高度",
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
        defaultValue: true,
      },
      boxModelEditor: {
        label: "CSS 盒模型",
        type: "composite",
        defaultValue: { margin: [0, 0, 0, 0], padding: [0, 0, 0, 0] },
        compositeFields: {
          margin: {
            type: "number",
            transform: Number,
            defaultValue: [0, 0, 0, 0],
            unit: "%",
          },
          padding: {
            type: "number",
            transform: Number,
            defaultValue: [0, 0, 0, 0],
            unit: "%",
          },
        },
        renderCustomInput: ({ value, onChange }) => (
          <BoxModelEditor value={value} onChange={onChange} />
        ),
      },
      backgroundColor: {
        label: "顏色",
        type: "color",
        defaultColor: "rgba(0,0,0,0)",
        defaultOpacity: 1,
        step: 10,
        min: 0,
        max: 100,
      },
      media: {
        label: "媒體",
        type: "object",
        defaultValue: { type: "", url: "" },
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
    label: "可自由拖動元素",
    properties: {
      horizontalAlignment: {
        label: "水平對齊",
        type: "buttonGroup",
        options: [
          {
            label: "靠左對齊",
            value: "left",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3 0v16H2V0h1Zm10 6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h7Z"></path></svg>',
          },
          {
            value: "center",
            label: "對齊至水平置中",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9 12.001v4H8v-4h1Zm3-6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h7ZM9 0v4.001H8V0h1Z"></path></svg>',
          },
          {
            value: "right",
            label: "靠右對齊",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 0v16h-1V0h1Zm-4 6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h7Z"></path></svg>',
          },
        ],
      },
      verticalAlignment: {
        label: "垂直對齊",
        type: "buttonGroup",
        options: [
          {
            value: "top",
            label: "置頂對齊",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9 5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2Zm7-3v1H0V2h16Z"></path></svg>',
          },
          {
            value: "middle",
            label: "對齊至垂直中",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9 3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2Zm7.001 4v1H12V7h4.001ZM4 7v1H0V7h4Z"></path></svg>',
          },
          {
            value: "bottom",
            label: "置底對齊",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M16 13v1H0v-1h16ZM9 2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2Z"></path></svg>',
          },
        ],
      },
      distribution: {
        label: "分佈",
        type: "buttonGroup",
        options: [
          {
            value: "horizontal",
            label: "水平分佈",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 0v16H0V0h1Zm15 0v16h-1V0h1ZM9 4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h2Z"></path></svg>',
          },
          {
            value: "vertical",
            label: "垂直分佈",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M16 15v1H0v-1h16Zm-5-9a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6Zm5-6v1H0V0h16Z"></path></svg>',
          },
        ],
      },
      // TODO:位置處理 layout中
      position: {
        label: "位置",
        type: "composite",
        transform: Number,
        defaultValue: { x: 0, y: 0 },
        compositeFields: {
          x: {
            label: "x",
            type: "number",
            transform: Number,
            defaultValue: 0,
            unit: "px",
          },
          y: {
            label: "y",
            type: "number",
            transform: Number,
            defaultValue: 0,
            unit: "px",
          },
        },
      },
      // TODO:之後處理 拖拉
      zIndex: {
        label: "層級索引",
        type: "number",
        defaultValue: 0,
      },
    },
    subtypes: {
      text: {
        type: "text",
        label: "文字元素",
        properties: {
          size: {
            label: "大小",
            type: "composite",
            transform: Number,
            defaultValue: (elementType: string) => {
              return textDefaults[elementType]?.size || {};
            },
            compositeFields: {
              width: {
                label: "寬度",
                type: "number",
                transform: Number,
                unit: "px",
              },
              height: {
                label: "高度",
                type: "number",
                transform: Number,
                unit: "px",
              },
            },
          },
          fontSize: {
            label: "字體大小",
            type: "number",
            defaultValue: (elementType: string) => {
              return textDefaults[elementType]?.fontSize || {};
            },
          },
          // TODO:沒有處理好
          fontType: {
            label: "字體主題",
            type: "select",
            options: [
              { value: "H1", label: "標題1", size: 72, unit: "px" },
              { value: "H2", label: "標題2", size: 42, unit: "px" },
              { value: "H3", label: "標題3", size: 38, unit: "px" },
              { value: "H4", label: "標題4", size: 34, unit: "px" },
              { value: "H5", label: "標題5", size: 28, unit: "px" },
              { value: "pre1", label: "段落１", size: 28, unit: "px" },
              { value: "pre2", label: "段落2", size: 16, unit: "px" },
              { value: "pre3", label: "段落3", size: 14, unit: "px" },
            ],
            defaultValue: (elementType: string) => {
              return textDefaults[elementType]?.fontSize || {};
            },
          },
          // TODO:重新處理
          textColor: {
            label: "文字顏色",
            type: "color",
            defaultColor: "#000000",
            defaultOpacity: 100,
            step: 10,
            min: 0,
            max: 100,
          },
          letterSpacing: {
            label: "字距",
            type: "number",
            defaultValue: 0,
            unit: "px",
            min: 0,
            max: 10,
          },
          lineHeight: {
            label: "行距",
            type: "number",
            defaultValue: (elementType: string) => {
              return textDefaults[elementType]?.lineHeight || {};
            },
            min: 1,
            max: 3,
          },
          fontFamily: {
            label: "字體系列",
            type: "text",
            defaultValue: "Arial",
          },
          // fontWeight: {
          //   label: "字體粗細",
          //   type: "button",
          //   options: [
          //     normal: { label: "正常", type: "button", transform: String },
          //     bold: { label: "粗體", type: "button", transform: String },
          //   ],
          // },
          // fontStyle: {
          //   label: "字體樣式",
          //   type: "button",
          //   options: {
          //     normal: { label: "正常", type: "button", transform: String },
          //     italic: { label: "斜體", type: "button", transform: String },
          //   },
          //   defaultValue: "normal",
          // },
          // textDecoration: {
          //   label: "文字裝飾",
          //   type: "button",
          //   options: {
          //     none: { label: "無", type: "button", transform: String },
          //     underline: { label: "下劃線", type: "button", transform: String },
          //     lineThrough: {
          //       label: "刪除線",
          //       type: "button",
          //       transform: String,
          //     },
          //   },
          // },
        },
      },

      // buttonElement: {
      //   type: "buttonElement",
      //   label: "按鈕元素",
      //   properties: {
      //     horizontalAlignment: {
      //       label: "水平對齊",
      //       type: "button",
      //       options: {
      //         left: { label: "靠左對齊", type: "button", transform: String },
      //         center: {
      //           label: "對齊至水平置中",
      //           type: "button",
      //           transform: String,
      //         },
      //         right: { label: "靠右對齊", type: "button", transform: String },
      //       },
      //       defaultValue: "left",
      //     },
      //     verticalAlignment: {
      //       label: "垂直對齊",
      //       type: "button",
      //       options: {
      //         top: { label: "置頂對齊", type: "button", transform: String },
      //         middle: {
      //           label: "對齊至垂直中",
      //           type: "button",
      //           transform: String,
      //         },
      //         bottom: { label: "下", type: "button", transform: String },
      //       },
      //       defaultValue: "top",
      //     },
      //     distribution: {
      //       label: "分佈",
      //       type: "button",
      //       options: [
      //         { value: "horizontal", label: "水平分佈" },
      //         { value: "vertical", label: "垂直分佈" },
      //       ],
      //       defaultValue: "none",
      //     },
      //     size: {
      //       label: "大小",
      //       type: "custom",
      //       defaultValue: { width: 100, height: 100, x: 0, y: 0 },
      //       compositeFields: {
      //         width: {
      //           label: "寬度",
      //           type: "number",
      //           defaultValue: 100,
      //           unit: "px",
      //         },
      //         height: {
      //           label: "高度",
      //           type: "number",
      //           defaultValue: 100,
      //           unit: "px",
      //         },
      //         x: { label: "X", type: "number", defaultValue: 0, unit: "px" },
      //         y: { label: "Y", type: "number", defaultValue: 0, unit: "px" },
      //       },
      //     },
      //     zIndex: {
      //       label: "層級索引",
      //       type: "number",
      //       defaultValue: 0,
      //     },
      //     text: {
      //       label: "按鈕文字",
      //       type: "text",
      //       defaultValue: "按鈕",
      //     },
      //     backgroundColor: {
      //       label: "背景顏色",
      //       type: "color",
      //       defaultValue: "#ffffff",
      //     },
      //     textColor: {
      //       label: "文字顏色",
      //       type: "color",
      //       defaultValue: "#000000",
      //     },
      //     border: {
      //       label: "邊框",
      //       type: "custom",
      //       defaultValue: { width: 1, style: "solid", color: "#000000" },
      //       compositeFields: {
      //         width: {
      //           label: "邊框寬度",
      //           type: "number",
      //           defaultValue: 1,
      //           unit: "px",
      //         },
      //         style: {
      //           label: "邊框樣式",
      //           type: "button",
      //           // options: { solid: "實線", dashed: "虛線", dotted: "點線" },
      //           defaultValue: "solid",
      //         },
      //         color: {
      //           label: "邊框顏色",
      //           type: "color",
      //           defaultValue: "#000000",
      //         },
      //       },
      //     },
      //     borderRadius: {
      //       label: "邊框圓角",
      //       type: "number",
      //       defaultValue: 4,
      //       unit: "px",
      //     },
      //     padding: {
      //       label: "內邊距",
      //       type: "custom",
      //       defaultValue: { top: 10, right: 20, bottom: 10, left: 20 },
      //       compositeFields: {
      //         top: {
      //           label: "上",
      //           type: "number",
      //           defaultValue: 10,
      //           unit: "px",
      //         },
      //         right: {
      //           label: "右",
      //           type: "number",
      //           defaultValue: 20,
      //           unit: "px",
      //         },
      //         bottom: {
      //           label: "下",
      //           type: "number",
      //           defaultValue: 10,
      //           unit: "px",
      //         },
      //         left: {
      //           label: "左",
      //           type: "number",
      //           defaultValue: 20,
      //           unit: "px",
      //         },
      //       },
      //     },
      //     hoverBackgroundColor: {
      //       label: "懸停背景顏色",
      //       type: "color",
      //       defaultValue: "#e0e0e0",
      //     },
      //     activeBackgroundColor: {
      //       label: "按下背景顏色",
      //       type: "color",
      //       defaultValue: "#d0d0d0",
      //     },
      //   },
      // },

      // image: {
      //   type: "image",
      //   label: "圖片",
      //   properties: {
      //     src: {
      //       label: "圖片 URL",
      //       type: "text",
      //       defaultValue: "",
      //     },
      //     alt: {
      //       label: "替代文字",
      //       type: "text",
      //       defaultValue: "",
      //     },
      //     size: {
      //       label: "尺寸",
      //       type: "custom",
      //       defaultValue: { width: 100, height: 100 },
      //       compositeFields: {
      //         width: {
      //           label: "寬度",
      //           type: "number",
      //           defaultValue: 100,
      //           unit: "px",
      //         },
      //         height: {
      //           label: "高度",
      //           type: "number",
      //           defaultValue: 100,
      //           unit: "px",
      //         },
      //       },
      //     },
      //     border: {
      //       label: "邊框",
      //       type: "custom",
      //       defaultValue: { width: 1, style: "solid", color: "#000000" },
      //       compositeFields: {
      //         width: {
      //           label: "邊框寬度",
      //           type: "number",
      //           defaultValue: 1,
      //           unit: "px",
      //         },
      //         style: {
      //           label: "邊框樣式",
      //           type: "button",
      //           // options: { solid: "實線", dashed: "虛線", dotted: "點線" },
      //           defaultValue: "solid",
      //         },
      //         color: {
      //           label: "邊框顏色",
      //           type: "color",
      //           defaultValue: "#000000",
      //         },
      //       },
      //     },
      //     borderRadius: {
      //       label: "邊框圓角",
      //       type: "number",
      //       defaultValue: 0,
      //       unit: "px",
      //     },
      //     alignment: {
      //       label: "對齊",
      //       type: "button",
      //       options: {
      //         left: { label: "靠左對齊", type: "button", transform: String },
      //         center: { label: "置中對齊", type: "button", transform: String },
      //         right: { label: "靠右對齊", type: "button", transform: String },
      //       },
      //       defaultValue: "center",
      //     },
      //     link: {
      //       label: "連結",
      //       type: "text",
      //       defaultValue: "",
      //     },
      //     caption: {
      //       label: "說明文字",
      //       type: "text",
      //       defaultValue: "",
      //     },
      //   },
      // },

      // menu: {
      //   type: "menu",
      //   label: "選單",
      //   properties: {
      //     items: {
      //       label: "選單項目",
      //       type: "custom",
      //       defaultValue: [],
      //       renderCustomInput: ({ value, onChange }) => (
      //         <div>
      //           選單項目編輯器（占位符）
      //           {value.map((item, index) => (
      //             <div key={index}>
      //               <input
      //                 type="text"
      //                 value={item.label}
      //                 onChange={(e) => {
      //                   const newItems = [...value];
      //                   newItems[index] = {
      //                     ...newItems[index],
      //                     label: e.target.value,
      //                   };
      //                   onChange(newItems);
      //                 }}
      //               />
      //               <input
      //                 type="text"
      //                 value={item.url}
      //                 onChange={(e) => {
      //                   const newItems = [...value];
      //                   newItems[index] = {
      //                     ...newItems[index],
      //                     url: e.target.value,
      //                   };
      //                   onChange(newItems);
      //                 }}
      //               />
      //               <button
      //                 onClick={() => {
      //                   const newItems = value.filter((_, i) => i !== index);
      //                   onChange(newItems);
      //                 }}
      //               >
      //                 刪除
      //               </button>
      //             </div>
      //           ))}
      //           <button
      //             onClick={() => {
      //               onChange([...value, { label: "", url: "" }]);
      //             }}
      //           >
      //             新增項目
      //           </button>
      //         </div>
      //       ),
      //     },
      //     layout: {
      //       label: "佈局",
      //       type: "button",
      //       options: [
      //         { value: "horizontal", label: "水平" },
      //         { value: "vertical", label: "垂直" },
      //       ],
      //       defaultValue: "vertical",
      //     },
      //     style: {
      //       label: "樣式",
      //       type: "custom",
      //       defaultValue: { padding: 10, backgroundColor: "#ffffff" },
      //       compositeFields: {
      //         padding: {
      //           label: "內邊距",
      //           type: "number",
      //           defaultValue: 10,
      //           unit: "px",
      //         },
      //         backgroundColor: {
      //           label: "背景顏色",
      //           type: "color",
      //           defaultValue: "#ffffff",
      //         },
      //       },
      //     },
      //     itemTemplate: {
      //       label: "選單項目模板",
      //       type: "custom",
      //       defaultValue: { label: "", url: "" },
      //       compositeFields: {
      //         label: { label: "標籤", type: "text", defaultValue: "" },
      //         url: { label: "URL", type: "text", defaultValue: "" },
      //       },
      //     },
      //     addNewItem: {
      //       label: "新增項目",
      //       type: "button",
      //       action: () => {
      //         // Function to add a new item to the menu
      //       },
      //     },
      //     removeItem: {
      //       label: "刪除項目",
      //       type: "button",
      //       action: () => {
      //         // Function to remove the item at the specified index
      //       },
      //     },
      //   },
      // },
    },
  },
};
