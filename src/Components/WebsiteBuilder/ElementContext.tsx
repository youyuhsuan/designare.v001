// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useCallback,
// } from "react";
// import { v4 } from "uuid";

// export interface BaseElement {
//   id: string;
//   type: string;
//   name: string; // 元素名稱
// }

// export interface SliderElement extends BaseElement {
//   type: "slider";
//   slides: { id: string; content: string }[];
//   height: number;
//   isLayout: boolean;
//   position: { x: number; y: number };
// }

// type Element = SliderElement /* | 其他元素類型 */;

// interface Section {
//   id: string;
//   name: string;
//   elements: Element[];
// }

// interface ElementContextType {
//   sections: Section[]; // 所有的 Section 對象
//   addSection: (name: string) => void; // 新增Section 對象
//   addElementToSection: (sectionId: string, element: Element) => void;
//   updateElementInSection: (
//     sectionId: string,
//     elementId: string,
//     updates: Partial<Element>
//   ) => void;
//   deleteElementFromSection: (sectionId: string, elementId: string) => void;
//   reorderElementsInSection: (
//     sectionId: string,
//     startIndex: number,
//     endIndex: number
//   ) => void;
//   updateSliderPropertiesInSection: (
//     sectionId: string,
//     sliderId: string,
//     updates: Partial<Omit<SliderElement, "id" | "type" | "name" | "slides">>
//   ) => void;
// }

// export const ElementContext = createContext<ElementContextType | undefined>(
//   undefined
// );

// export const ElementProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [sections, setSections] = useState<Section[]>([]);

//   const addSection = useCallback((name: string) => {
//     console.log("Adding section with name:", name);
//     setSections((prev) => [...prev, { id: v4(), name, elements: [] }]);
//   }, []);

//   const addElementToSection = useCallback(
//     (sectionId: string, element: Element) => {
//       setSections((prev) =>
//         prev.map((section) =>
//           section.id === sectionId
//             ? { ...section, elements: [...section.elements, element] }
//             : section
//         )
//       );
//     },
//     []
//   );
//   const deleteElementFromSection = useCallback(
//     (sectionId: string, elementId: string) => {
//       setSections((prev) =>
//         prev.map((section) =>
//           section.id === sectionId
//             ? {
//                 ...section,
//                 elements: section.elements.filter(
//                   (element) => element.id !== elementId
//                 ),
//               }
//             : section
//         )
//       );
//     },
//     []
//   );

//   const reorderElementsInSection = useCallback(
//     (sectionId: string, startIndex: number, endIndex: number) => {
//       setSections((prev) =>
//         prev.map((section) => {
//           if (section.id === sectionId) {
//             const newElements = Array.from(section.elements);
//             const [reorderedItem] = newElements.splice(startIndex, 1);
//             newElements.splice(endIndex, 0, reorderedItem);
//             return { ...section, elements: newElements };
//           }
//           return section;
//         })
//       );
//     },
//     []
//   );
//   const updateElementInSection = useCallback(
//     (sectionId: string, elementId: string, updates: Partial<Element>) => {
//       setSections((prev) =>
//         prev.map((section) =>
//           section.id === sectionId
//             ? {
//                 ...section,
//                 elements: section.elements.map((element) =>
//                   element.id === elementId
//                     ? { ...element, ...updates }
//                     : element
//                 ),
//               }
//             : section
//         )
//       );
//     },
//     []
//   );
//   const updateSliderPropertiesInSection = useCallback(
//     (
//       sectionId: string,
//       sliderId: string,
//       updates: Partial<Omit<SliderElement, "id" | "type" | "name" | "slides">>
//     ) => {
//       setSections((prev) =>
//         prev.map((section) =>
//           section.id === sectionId
//             ? {
//                 ...section,
//                 elements: section.elements.map((element) =>
//                   element.id === sliderId && element.type === "slider"
//                     ? { ...element, ...updates }
//                     : element
//                 ),
//               }
//             : section
//         )
//       );
//     },
//     []
//   );

//   const value: ElementContextType = {
//     sections,
//     addSection,
//     addElementToSection,
//     updateElementInSection,
//     deleteElementFromSection,
//     reorderElementsInSection,
//     updateSliderPropertiesInSection,
//   };

//   return (
//     <ElementContext.Provider value={value}>{children}</ElementContext.Provider>
//   );
// };

// export const useElementContext = () => {
//   const context = useContext(ElementContext);
//   if (!context) {
//     throw new Error("useElementContext must be used within an ElementProvider");
//   }
//   return context;
// };
