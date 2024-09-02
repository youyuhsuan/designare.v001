// import { useState, useRef, useCallback, useEffect } from "react";
// import { useDraggable } from "@dnd-kit/core";

// interface ElementInteractionProps {
//   id: string;
//   type: string;
//   content: string;
//   config: any;
//   isSelected: boolean;
//   onUpdate: (updates: any) => void;
//   onDelete: () => void;
//   parentHandleResize: (id: string, size: any, direction: string) => void;
//   parentOnMouseUp: (e: MouseEvent) => void;
//   onClick?: (e: React.MouseEvent) => void;
// }

// // 定義 useElementInteraction 函數，接受一組參數來管理元素的互動行為
// export const useElementInteraction = ({
//   id,
//   type,
//   content,
//   config,
//   isSelected,
//   onUpdate,
//   onDelete,
//   parentHandleResize,
//   parentOnMouseUp,
//   onClick,
// }: ElementInteractionProps) => {
//   // 編輯狀態的管理，初始為 false
//   const [isEditing, setIsEditing] = useState(false);

//   // 編輯內容的狀態，初始值為傳入的 content
//   const [editableContent, setEditableContent] = useState(content);

//   // 互動模式的狀態 (拖拉、調整大小等)，初始為 "none"
//   const [interactionMode, setInteractionMode] = useState<
//     "none" | "dragging" | "resizing"
//   >("none");

//   // 用於引用目標元素的 Ref
//   const elementRef = useRef<HTMLElement | null>(null);

//   // 用於記錄開始拖動或調整大小時的狀態
//   const interactionStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

//   // 用於跟踪調整大小的方向 (例如右側、底部等)
//   const resizeDirectionRef = useRef<string | null>(null);

//   // 選擇範圍的狀態，初始為 null
//   const [selection, setSelection] = useState<{
//     start: number;
//     end: number;
//   } | null>(null);

//   // 用於引用輸入框的 Ref
//   const inputRef = useRef<HTMLInputElement>(null);

//   // 元素是否被選中的狀態，初始值為傳入的 isSelected
//   const [isElementSelected, setIsElementSelected] = useState(isSelected);

//   // 用於標記是否正在拖動的狀態
//   const isDraggingRef = useRef(false);

//   // 使用 useDraggable hook 管理拖動行為
//   const { attributes, listeners, setNodeRef, transform, isDragging } =
//     useDraggable({
//       id,
//       data: { type },
//     });

//   // 處理點擊事件，當點擊時如果不是正在拖動，則設置為選中狀態
//   const handleClick = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation(); // 防止事件冒泡
//       if (!isDraggingRef.current) {
//         // 如果不是正在拖動
//         setIsElementSelected(true); // 設置為選中狀態
//         onClick?.(e); // 如果提供了 onClick 函數，則調用它
//       }
//     },
//     [onClick] // 依賴 onClick 函數
//   );

//   // 處理外部點擊事件，點擊外部時取消選中狀態
//   const handleOutsideClick = useCallback(
//     (e: MouseEvent) => {
//       if ((e.target as HTMLElement).closest(`[data-id="${id}"]`)) return; // 如果點擊在當前元素內部則不處理
//       setIsElementSelected(false); // 取消選中狀態
//     },
//     [id] // 依賴 id
//   );

//   // 設置外部點擊事件的監聽器
//   useEffect(() => {
//     document.addEventListener("click", handleOutsideClick);
//     return () => {
//       document.removeEventListener("click", handleOutsideClick);
//     };
//   }, [handleOutsideClick]);

//   // 處理鼠標移動事件，用於調整元素大小
//   const handleMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (interactionMode === "resizing") {
//         // 如果當前是調整大小模式
//         const deltaX = e.clientX - interactionStartRef.current.x; // 計算 X 軸的變化量
//         const deltaY = e.clientY - interactionStartRef.current.y; // 計算 Y 軸的變化量
//         let newWidth = interactionStartRef.current.width; // 計算新的寬度
//         let newHeight = interactionStartRef.current.height; // 計算新的高度

//         const direction = resizeDirectionRef.current; // 取得調整方向
//         if (direction?.includes("right")) newWidth += deltaX; // 如果是右邊調整，增加寬度
//         if (direction?.includes("left")) newWidth -= deltaX; // 如果是左邊調整，減少寬度
//         if (direction?.includes("bottom")) newHeight += deltaY; // 如果是底部調整，增加高度
//         if (direction?.includes("top")) newHeight -= deltaY; // 如果是頂部調整，減少高度

//         newWidth = Math.max(50, newWidth); // 寬度最小為 50
//         newHeight = Math.max(50, newHeight); // 高度最小為 50

//         onUpdate({
//           config: {
//             ...config,
//             size: { width: newWidth, height: newHeight }, // 更新元素的尺寸
//           },
//         });
//       }
//     },
//     [interactionMode, config, onUpdate] // 依賴 interactionMode, config 和 onUpdate
//   );

//   // 處理鼠標鬆開事件，結束調整大小並通知父元素
//   const handleMouseUp = useCallback(
//     (e: MouseEvent) => {
//       if (interactionMode === "resizing") {
//         // 如果是調整大小模式
//         parentHandleResize(
//           id,
//           {
//             width: config.size.width, // 傳遞當前寬度
//             height: config.size.height, // 傳遞當前高度
//           },
//           resizeDirectionRef.current || "" // 傳遞調整方向
//         );
//         isDraggingRef.current = false; // 標記為不再拖動
//       }

//       setInteractionMode("none"); // 結束當前互動模式
//       document.removeEventListener("mousemove", handleMouseMove); // 移除鼠標移動事件監聽器
//       document.removeEventListener("mouseup", handleMouseUp); // 移除鼠標鬆開事件監聽器
//       parentOnMouseUp(e); // 調用父元素的 onMouseUp
//     },
//     [
//       interactionMode,
//       handleMouseMove,
//       parentOnMouseUp,
//       parentHandleResize,
//       id,
//       config.size.width,
//       config.size.height,
//     ] // 依賴 interactionMode, handleMouseMove, parentOnMouseUp, parentHandleResize, id, config.size.width 和 config.size.height
//   );

//   // 處理滑鼠按下事件
//   const handleMouseDown = useCallback(
//     (e: React.MouseEvent) => {
//       setIsMouseDown(true); // 設置滑鼠按下狀態為 true
//       if (isEditing) return; // 如果處於編輯狀態，則不處理

//       const target = e.target as HTMLElement; // 取得事件目標
//       if (target.closest(".resize-handle")) {
//         // 如果目標元素是調整大小的手柄
//         setInteractionMode("resizing"); // 設置互動模式為調整大小
//         const direction = target.getAttribute("data-direction") || ""; // 取得調整方向
//         resizeDirectionRef.current = direction; // 記錄調整方向
//       } else {
//         setInteractionMode("dragging"); // 設置互動模式為拖動
//         isDraggingRef.current = true; // 標記為正在拖動
//       }

//       interactionStartRef.current = {
//         x: e.clientX, // 記錄鼠標起始 X 坐標
//         y: e.clientY, // 記錄鼠標起始 Y 坐標
//         width: config.size.width, // 記錄當前寬度
//         height: config.size.height, // 記錄當前高度
//       };

//       document.addEventListener("mousemove", handleMouseMove); // 添加鼠標移動事件監聽器
//       document.addEventListener("mouseup", handleMouseUp); // 添加鼠標鬆開事件監聽器
//     },
//     [
//       isEditing,
//       config.size.width,
//       config.size.height,
//       handleMouseMove,
//       handleMouseUp,
//     ] // 依賴 isEditing, config.size.width, config.size.height, handleMouseMove 和 handleMouseUp
//   );

//   // 處理滑鼠鬆開事件
//   const handleMouseUp = useCallback(
//     (e: MouseEvent) => {
//       setIsMouseDown(false); // 設置滑鼠按下狀態為 false
//       if (interactionMode === "resizing") {
//         // 如果是調整大小模式
//         parentHandleResize(
//           id,
//           {
//             width: config.size.width, // 傳遞當前寬度
//             height: config.size.height, // 傳遞當前高度
//           },
//           resizeDirectionRef.current || "" // 傳遞調整方向
//         );
//         isDraggingRef.current = false; // 標記為不再拖動
//       }

//       setInteractionMode("none"); // 結束當前互動模式
//       document.removeEventListener("mousemove", handleMouseMove); // 移除鼠標移動事件監聽器
//       document.removeEventListener("mouseup", handleMouseUp); // 移除鼠標鬆開事件監聽器
//       parentOnMouseUp(e); // 調用父元素的 onMouseUp
//     },
//     [
//       interactionMode,
//       handleMouseMove,
//       parentOnMouseUp,
//       parentHandleResize,
//       id,
//       config.size.width,
//       config.size.height,
//     ] // 依賴 interactionMode, handleMouseMove, parentOnMouseUp, parentHandleResize, id, config.size.width 和 config.size.height
//   );

//   // 開始編輯狀態的函數
//   const startEditing = useCallback(() => {
//     setIsEditing(true); // 設置編輯狀態為 true
//     setIsElementSelected(false); // 設置元素選擇狀態為 false
//     setSelection({ start: 0, end: (content as string).length }); // 設置選擇範圍為整個內容
//   }, [content]); // 依賴 content，當 content 改變時，會重新創建 startEditing 函數

//   // 停止編輯狀態的函數
//   const stopEditing = useCallback(() => {
//     setIsEditing(false); // 設置編輯狀態為 false
//     setSelection(null); // 清除選擇範圍
//     // 如果編輯內容與原內容不相同，則調用 onUpdate 函數更新內容
//     if (editableContent !== content) {
//       onUpdate({ content: editableContent });
//     }
//   }, [editableContent, content, onUpdate]); // 依賴 editableContent, content 和 onUpdate，當這些依賴改變時，會重新創建 stopEditing 函數

//   // 處理雙擊事件的函數
//   const handleDoubleClick = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation(); // 防止事件冒泡
//       // 如果元素類型為 "text" 或 "button"，則開始編輯
//       if (type === "text" || type === "button") {
//         startEditing(); // 調用 startEditing 函數
//       }
//     },
//     [type, startEditing] // 依賴 type 和 startEditing，當這些依賴改變時，會重新創建 handleDoubleClick 函數
//   );

//   // 處理失去焦點事件的函數
//   const handleBlur = useCallback(() => {
//     stopEditing(); // 調用 stopEditing 函數以停止編輯
//   }, [stopEditing]); // 依賴 stopEditing，當 stopEditing 改變時，會重新創建 handleBlur 函數

//   // 處理內容變更事件的函數
//   const handleContentChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       setEditableContent(e.target.value); // 更新編輯內容為輸入框中的值
//     },
//     [] // 空依賴數組，表示 handleContentChange 不依賴於其他變量
//   );

//   // 設置鍵盤事件處理器，處理刪除鍵
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (isEditing || !isSelected) return; // 如果處於編輯狀態或未選中，則不處理
//       if (
//         event.key === "Backspace" && // 如果按下的是刪除鍵
//         document.activeElement === elementRef.current // 如果焦點在當前元素上
//       ) {
//         event.preventDefault(); // 防止默認刪除操作
//         event.stopPropagation(); // 防止事件冒泡
//         onDelete(); // 調用刪除函數
//       }
//     };

//     const element = elementRef.current; // 取得當前元素
//     if (element) {
//       element.addEventListener("keydown", handleKeyDown); // 添加鍵盤事件監聽器
//       return () => element.removeEventListener("keydown", handleKeyDown); // 清理鍵盤事件監聽器
//     }
//   }, [isEditing, isSelected, onDelete]);

//   // 返回一組函數和狀態，用於元素的互動管理
//   return {
//     isEditing,
//     editableContent,
//     setEditableContent,
//     interactionMode,
//     elementRef,
//     isDragging,
//     attributes,
//     listeners,
//     setNodeRef,
//     handleMouseDown,
//     handleMouseUp,
//     handleDoubleClick,
//     handleContentChange,
//     isElementSelected,
//     setIsElementSelected,
//     handleBlur,
//     handleClick,
//     handleOutsideClick,
//     startEditing,
//     stopEditing,
//     isMouseDown,
//   };
// };
