import { ElementConfigs } from "@/src/Components/WebsiteBuilder/BuilderInterface/index";
import { Content } from "next/font/google";
import { RxBorderWidth } from "react-icons/rx";

export const elementConfigs: ElementConfigs = {
  layoutElement: {
    type: "layoutElement",
    label: "佈局",
    properties: {
      size: {
        label: "大小",
        type: "composite",
        defaultValue: { width: 100, height: 100 },
        compositeFields: {
          width: {
            label: "寬度",
            type: "number",
            defaultValue: 100,
            unit: "%",
          },
          height: {
            label: "高度",
            type: "number",
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
        type: "boxModel",
        defaultValue: { margin: [0, 0, 0, 0], padding: [20, 20, 20, 20] },
        compositeFields: {
          margin: {
            type: "number",
            defaultValue: [0, 0, 0, 0],
            unit: "%",
          },
          padding: {
            type: "number",
            defaultValue: [20, 20, 20, 20],
            unit: "%",
          },
        },
      },
      backgroundColor: {
        label: "顏色",
        type: "color",
        defaultColor: "rgba(0,0,0,0)",
        defaultOpacity: 100,
        step: 10,
        min: 0,
        max: 100,
      },
      media: {
        label: "媒體",
        type: "mediaUpload",
        defaultValue: { type: "image", url: "" },
        accept: "image/*,video/*",
        maxSize: 5000000,
      },
    },
    subtypes: {
      layout: {
        type: "layout",
        label: "佈局",
        properties: {
          gap: {
            label: "間隔",
            type: "number",
            defaultValue: {
              layout: 0,
              sidebarLayout: 20,
              columnizedLayout: 30,
              gridLayout: 20,
            },
            unit: "px",
          },
          columnWidths: {
            label: "欄寬比例",
            type: "composite",
            defaultValue: {
              layout: { left: 0, middle: 0, right: 0 },
              sidebarLayout: { left: 30, middle: 0, right: 70 },
              columnizedLayout: { left: 50, middle: 25, right: 25 },
              gridLayout: null,
            },
            unit: "%",
            compositeFields: {
              left: {
                label: "左欄寬度",
                type: "number",
                unit: "%",
              },
              middle: {
                label: "中間寬度",
                type: "number",
                unit: "%",
              },
              right: {
                label: "右欄寬度",
                type: "number",
                unit: "%",
              },
            },
          },
          columns: {
            label: "列數",
            type: "number",
            defaultValue: {
              layout: null,
              sidebarLayout: null,
              columnizedLayout: null,
              gridLayout: 3,
            },
            min: 1,
            max: 12,
          },
          middleColumnSplit: {
            label: "中欄分割",
            type: "checkbox",
            defaultValue: {
              layout: false,
              sidebarLayout: false,
              columnizedLayout: true,
              gridLayout: null,
            },
          },
          rowHeight: {
            label: "行高",
            type: "number",
            defaultValue: {
              layout: null,
              sidebarLayout: null,
              columnizedLayout: 200,
              gridLayout: null,
            },
            unit: "px",
          },
          boxModelEditor: {
            label: "CSS 盒模型",
            type: "boxModel",
            defaultValue: { margin: [0, 0, 0, 0], padding: [0, 0, 0, 0] },
            compositeFields: {
              margin: {
                type: "number",
                defaultValue: [0, 0, 0, 0],
                unit: "%",
              },
              padding: {
                type: "number",
                defaultValue: [0, 0, 0, 0],
                unit: "%",
              },
            },
          },
          backgroundColor: {
            label: "顏色",
            type: "color",
            defaultColor: "rgba(0,0,0,0)",
            defaultOpacity: 100,
            step: 10,
            min: 0,
            max: 100,
          },
          media: {
            label: "媒體",
            type: "mediaUpload",
            defaultValue: { type: "image", url: "" },
            accept: "image/*,video/*",
            maxSize: 5000000,
          },
        },
      },
      navbar: {
        type: "navbar",
        label: "導航欄",
        properties: {
          size: {
            label: "大小",
            type: "composite",
            defaultValue: { width: 1200, height: 60 },
            compositeFields: {
              width: {
                label: "寬度",
                type: "number",
                defaultValue: 1200,
                unit: "px",
              },
              height: {
                label: "高度",
                type: "number",
                defaultValue: 60,
                unit: "px",
              },
            },
          },
          backgroundColor: {
            label: "背景顏色",
            type: "color",
            defaultColor: "#ffffff",
            defaultOpacity: 100,
          },
          position: {
            label: "位置",
            type: "select",
            options: ["static", "fixed", "sticky"],
            defaultValue: "static",
          },
        },
      },
      footer: {
        type: "footer",
        label: "頁尾",
        properties: {
          size: {
            label: "大小",
            type: "composite",
            defaultValue: { width: 1200, height: 200 },
            compositeFields: {
              width: {
                label: "寬度",
                type: "number",
                defaultValue: 1200,
                unit: "px",
              },
              height: {
                label: "高度",
                type: "number",
                defaultValue: 200,
                unit: "px",
              },
            },
          },
          backgroundColor: {
            label: "背景顏色",
            type: "color",
            defaultColor: "#f8f9fa",
            defaultOpacity: 100,
          },
        },
      },
    },
  },
  freeDraggableElement: {
    type: "freeDraggableElement",
    label: "自由拖動元素",
    properties: {
      horizontalAlignment: {
        label: "水平對齊",
        type: "buttonGroup",
        options: [
          {
            value: { left: 0 },
            label: "靠左對齊",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3 0v16H2V0h1Zm10 6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h7Z"></path></svg>',
          },
          {
            value: { center: 0 },
            label: "對齊至水平置中",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9 12.001v4H8v-4h1Zm3-6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h7ZM9 0v4.001H8V0h1Z"></path></svg>',
          },
          {
            value: { right: 0 },
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
            value: { top: 0 },
            label: "置頂對齊",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9 5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h2Zm7-3v1H0V2h16Z"></path></svg>',
          },
          {
            value: { center: 0 },
            label: "對齊至垂直中",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M9 3a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2Zm7.001 4v1H12V7h4.001ZM4 7v1H0V7h4Z"></path></svg>',
          },
          {
            value: { bottom: 0 },
            label: "置底對齊",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M16 13v1H0v-1h16ZM9 2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2Z"></path></svg>',
          },
        ],
      },
      position: {
        label: "位置",
        type: "composite",
        defaultValue: { x: 0, y: 0 },
        compositeFields: {
          x: {
            label: "x",
            type: "number",
            defaultValue: 0,
            unit: "px",
          },
          y: {
            label: "y",
            type: "number",
            defaultValue: 0,
            unit: "px",
          },
        },
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
            compositeFields: {
              width: {
                label: "寬度",
                type: "number",
                unit: "px",
              },
              height: {
                label: "高度",
                type: "number",
                unit: "px",
              },
            },
            defaultValue: {
              H1: { width: 600, height: 86 },
              H2: { width: 600, height: 55 },
              H3: { width: 600, height: 49 },
              H4: { width: 600, height: 44 },
              H5: { width: 600, height: 31 },
              pre1: { width: 390, height: 86 },
              pre2: { width: 410, height: 77 },
              pre3: { width: 400, height: 45 },
            },
          },
          fontSize: {
            label: "字體大小",
            type: "number",
            defaultValue: {
              H1: 72,
              H2: 42,
              H3: 38,
              H4: 34,
              H5: 28,
              pre1: 28,
              pre2: 16,
              pre3: 14,
            },
            unit: "pt",
          },
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
            defaultValue: {
              H1: 1.2,
              H2: 1.3,
              H3: 1.4,
              H4: 1.4,
              H5: 1.5,
              pre1: 1.6,
              pre2: 1.6,
              pre3: 1.6,
            },
            min: 1,
            max: 3,
          },
          textAlign: {
            label: "文字對齊",
            type: "select",
            options: ["start", "end", "left", "right", "center"],
            defaultValue: "start",
          },
          fontFamily: {
            label: "字體系列",
            type: "select",
            options: [
              "Arial",
              "Verdana",
              "Courier New",
              "Georgia",
              "Times New Roman",
              "Tahoma",
              "Trebuchet MS",
              "Lucida Sans Unicode",
              "Palatino Linotype",
              "Arial Black",
              "Comic Sans MS",
            ],
            defaultValue: "Arial",
          },
          fontWeight: {
            label: "字體粗細",
            type: "select",
            options: ["normal", "bold", "bolder"],
            defaultValue: "normal",
          },
          textDecoration: {
            label: "文字裝飾",
            type: "select",
            options: ["none", "underline", "dotted", "overline"],
            defaultValue: "none",
          },
        },
      },
      buttonElement: {
        type: "buttonElement",
        label: "按鈕元素",
        properties: {
          content: {
            label: "文字",
            type: "text",
            defaultValue: "",
          },
          size: {
            label: "大小",
            type: "composite",
            defaultValue: { width: 142, height: 42 },
            compositeFields: {
              width: {
                label: "寬度",
                type: "number",
                unit: "px",
              },
              height: {
                label: "高度",
                type: "number",
                unit: "px",
              },
            },
          },
          boxModelEditor: {
            label: "CSS 盒模型",
            type: "boxModel",
            defaultValue: { margin: [0, 0, 0, 0], padding: [0, 0, 0, 0] },
            compositeFields: {
              margin: {
                type: "number",
                defaultValue: [0, 0, 0, 0],
                unit: "%",
              },
              padding: {
                type: "number",
                defaultValue: [0, 0, 0, 0],
                unit: "%",
              },
            },
          },
          fontSize: {
            label: "字體大小",
            type: "number",
            defaultValue: 16,
            unit: "pt",
          },
          textColor: {
            label: "文字顏色",
            type: "color",
            defaultValue: {
              filledButton: "#ffffff",
              outlinedButton: "#52525255",
              textButton: "#52525255",
            },
            defaultOpacity: 100,
            step: 10,
            min: 0,
            max: 100,
          },
          fontFamily: {
            label: "字體系列",
            type: "select",
            options: [
              "Arial",
              "Verdana",
              "Courier New",
              "Georgia",
              "Times New Roman",
              "Tahoma",
              "Trebuchet MS",
              "Lucida Sans Unicode",
              "Palatino Linotype",
              "Arial Black",
              "Comic Sans MS",
            ],
            defaultValue: "Arial",
          },
          backgroundColor: {
            label: "背景顏色",
            type: "color",
            defaultValue: {
              filledButton: "#252525",
              outlinedButton: "transparent",
              textButton: "transparent",
            },
            defaultOpacity: 100,
            step: 10,
            min: 0,
            max: 100,
          },
          borderWidth: {
            label: "邊框寬度",
            type: "number",
            defaultValue: {
              filledButton: 0,
              outlinedButton: 2,
              textButton: 0,
            },
          },
          borderStyle: {
            label: "邊框樣式",
            type: "select",
            options: ["solid", "dashed", "dotted", "none"],
            defaultValue: {
              filledButton: "none",
              outlinedButton: "solid",
              textButton: "none",
            },
          },
          borderColor: {
            label: "邊框顏色",
            type: "color",
            defaultColor: "#000000",
            defaultOpacity: 0,
            step: 10,
            min: 0,
            max: 100,
            defaultValue: {
              filledButton: "transparent",
              outlinedButton: "#007bff",
              textButton: "transparent",
            },
          },
          borderRadius: {
            label: "邊框圓角",
            type: "number",
            defaultValue: 4,
            unit: "px",
            min: 0,
          },
          hoverBackgroundColor: {
            label: "懸停背景顏色",
            type: "color",
            defaultValue: {
              filledButton: "#0056b3",
              outlinedButton: "#e6f2ff",
              textButton: "#e6f2ff",
            },
          },
          activeBackgroundColor: {
            label: "按下背景顏色",
            type: "color",
            defaultValue: {
              filledButton: "#004085",
              outlinedButton: "#cce5ff",
              textButton: "#cce5ff",
            },
          },
        },
      },
      image: {
        type: "image",
        label: "圖片",
        properties: {
          size: {
            label: "尺寸",
            type: "custom",
            defaultValue: {
              circle: { width: 300, height: 300 },
              square: { width: 300, height: 300 },
              fourTwo: { width: 600, height: 300 },
              fourThree: { width: 900, height: 300 },
              fullWidth: { width: 1200, height: 300 },
            },
            compositeFields: {
              width: {
                label: "寬度",
                type: "number",
                unit: "px",
              },
              height: {
                label: "高度",
                type: "number",
                unit: "px",
              },
            },
          },
          media: {
            label: "媒體",
            type: "mediaUpload",
            defaultValue: { type: "image", url: "" },
            accept: "image/*,video/*",
            maxSize: 5000000,
          },
          alt: {
            label: "替代文字",
            type: "text",
            defaultValue: "",
          },
          border: {
            label: "邊框",
            type: "custom",
            defaultValue: { width: 0, style: "solid", color: "#000000" },
            compositeFields: {
              width: {
                label: "邊框寬度",
                type: "number",
                unit: "px",
              },
              style: {
                label: "邊框樣式",
                type: "select",
                options: ["solid", "dashed", "dotted", "none"],
                defaultValue: "none",
              },
              color: {
                label: "邊框顏色",
                type: "color",
                defaultColor: "#000000",
                defaultOpacity: 0,
                step: 10,
                min: 0,
                max: 100,
              },
            },
          },
          borderRadius: {
            label: "邊框圓角",
            type: "number",
            defaultValue: {
              circle: 50,
              square: 0,
              fourTwo: 0,
              fourThree: 0,
              fullWidth: 0,
            },
            min: 0,
            unit: "%",
          },
          objectFit: {
            label: "圖片適應方式",
            type: "select",
            options: ["cover", "contain", "fill", "scale-down", "none"],
            defaultValue: "cover",
          },
        },
      },
      icon: {
        type: "icon",
        label: "圖標",
        properties: {
          size: {
            label: "大小",
            type: "number",
            defaultValue: 24,
            unit: "px",
          },
          color: {
            label: "顏色",
            type: "color",
            defaultColor: "#000000",
            defaultOpacity: 100,
          },
          name: {
            label: "圖標名稱",
            type: "select",
            options: ["user", "home", "settings", "mail", "heart"], // 這裡可以根據您的圖標庫擴展
            defaultValue: "user",
          },
        },
      },

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
