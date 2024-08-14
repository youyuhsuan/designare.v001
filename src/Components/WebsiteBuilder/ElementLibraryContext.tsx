// import React from "react";
// import { useElementContext } from "./ElementContext";
// import { useElementLibrary } from "./ElementLibraryContext";
// import { Input, Slider, Switch, Select, Card, Text } from "@nextui-org/react";

// // 編輯工具組件
// const SizeEditor: React.FC<{
//   element: any;
//   onUpdate: (updates: any) => void;
// }> = ({ element, onUpdate }) => (
//   <Card>
//     <Card.Body>
//       <Text h4>Size</Text>
//       <Input
//         label="Width"
//         value={element.width}
//         onChange={(e) => onUpdate({ width: e.target.value })}
//       />
//       <Input
//         label="Height"
//         value={element.height}
//         onChange={(e) => onUpdate({ height: e.target.value })}
//       />
//     </Card.Body>
//   </Card>
// );

// const ColorEditor: React.FC<{
//   element: any;
//   onUpdate: (updates: any) => void;
// }> = ({ element, onUpdate }) => (
//   <Card>
//     <Card.Body>
//       <Text h4>Color</Text>
//       <Input
//         label="Color"
//         type="color"
//         value={element.color}
//         onChange={(e) => onUpdate({ color: e.target.value })}
//       />
//     </Card.Body>
//   </Card>
// );

// const TextEditor: React.FC<{
//   element: any;
//   onUpdate: (updates: any) => void;
// }> = ({ element, onUpdate }) => (
//   <Card>
//     <Card.Body>
//       <Text h4>Text</Text>
//       <Input
//         label="Content"
//         value={element.text}
//         onChange={(e) => onUpdate({ text: e.target.value })}
//       />
//     </Card.Body>
//   </Card>
// );

// // 工具映射
// const toolMap: Record<
//   string,
//   React.FC<{ element: any; onUpdate: (updates: any) => void }>
// > = {
//   size: SizeEditor,
//   color: ColorEditor,
//   text: TextEditor,
// };

// // 使用 React.memo 來優化工具組件
// const MemoizedTool = React.memo(
//   ({
//     tool,
//     element,
//     onUpdate,
//   }: {
//     tool: string;
//     element: any;
//     onUpdate: (updates: any) => void;
//   }) => {
//     const ToolComponent = toolMap[tool];
//     return ToolComponent ? (
//       <ToolComponent element={element} onUpdate={onUpdate} />
//     ) : null;
//   },
//   (prevProps, nextProps) => {
//     // 只有當相關屬性改變時才重新渲染
//     return (
//       prevProps.element[prevProps.tool] === nextProps.element[nextProps.tool]
//     );
//   }
// );

// // SidebarEditor 組件
// const SidebarEditor: React.FC = () => {
//   const { selectedElement, updateElement } = useElementContext();
//   const { getElementDefinition } = useElementLibrary();

//   if (!selectedElement) {
//     return <Text>No element selected</Text>;
//   }

//   const elementDefinition = getElementDefinition(selectedElement.type);
//   const availableTools = elementDefinition.availableTools || [];

//   const handleUpdate = (updates: any) => {
//     updateElement(selectedElement.id, updates);
//   };

//   return (
//     <Card>
//       <Card.Header>
//         <Text h3>Edit {selectedElement.type}</Text>
//       </Card.Header>
//       <Card.Body>
//         {availableTools.map((tool) => (
//           <MemoizedTool
//             key={tool}
//             tool={tool}
//             element={selectedElement}
//             onUpdate={handleUpdate}
//           />
//         ))}
//       </Card.Body>
//     </Card>
//   );
// };

// export default React.memo(SidebarEditor);
