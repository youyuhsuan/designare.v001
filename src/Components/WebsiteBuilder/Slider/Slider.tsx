// import React, { useCallback } from "react";
// // import { useElementContext } from "./ElementContext"; // 确保路径正确

// interface SliderProps {
//   id: string;
// }

// const Slider: React.FC<SliderProps> = ({ id }) => {
//   const { elements, addElement, updateElement, deleteElement } =
//     useElementContext();

//   // 获取当前滑动器的元素
//   const sliderElements = elements.filter(
//     (element) => element.type === "slider" && element.id === id
//   );

//   const addSliderElement = useCallback(() => {
//     addElement({
//       type: "slider",
//       content: "New Slide",
//     });
//   }, [addElement]);

//   return (
//     <div className="slider">
//       {sliderElements.map((element) => (
//         <div key={element.id}>
//           {/* Render your element here */}
//           <span>{element.content}</span>
//           {/* Example of a button to update or delete the element */}
//           <button
//             onClick={() =>
//               updateElement(element.id, { content: "Updated Content" })
//             }
//           >
//             Update
//           </button>
//           <button onClick={() => deleteElement(element.id)}>Delete</button>
//         </div>
//       ))}
//       <button onClick={addSliderElement}>Add Slide</button>
//     </div>
//   );
// };

// export default Slider;
