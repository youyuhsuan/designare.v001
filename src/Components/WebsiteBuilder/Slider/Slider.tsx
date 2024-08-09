// import React, { useState, useCallback } from "react";
// import { useElements } from "@/";

// interface SliderProps {
//   id: string;
//   initialElements?: SliderElement[];
// }

// interface SliderElement {
//   id: string;
//   type: string;
//   props: Record<string, any>;
// }

// const Slider: React.FC<SliderProps> = ({ id, initialElements = [] }) => {
//   const [sliderElements, setSliderElements] =
//     useState<SliderElement[]>(initialElements);
//   const { updateElement } = useElements();

//   const addSliderElement = useCallback(
//     (newElement: SliderElement) => {
//       setSliderElements((prev) => [...prev, newElement]);
//       // 同步到 Section 級別的狀態
//       updateElement(id, {
//         props: { elements: [...sliderElements, newElement] },
//       });
//     },
//     [id, sliderElements, updateElement]
//   );

//   return (
//     <div className="slider">
//       {sliderElements.map((element) => (
//         <RenderElement key={element.id} {...element} />
//       ))}
//       <button
//         onClick={() =>
//           addSliderElement({
//             id: `slider-element-${Date.now()}`,
//             type: "image",
//             props: { src: "default-image.jpg" },
//           })
//         }
//       >
//         Add Slide
//       </button>
//     </div>
//   );
// };

// export default Slider;
