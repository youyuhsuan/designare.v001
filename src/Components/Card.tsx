"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styled from "styled-components";

const cardImages = [
  "/images/template1.jpg",
  "/images/template2.jpg",
  "/images/template3.jpg",
  "/images/template4.jpg",
];

const ShowcaseContainer = styled.section`
  position: absolute;
  top: 90dvh;
  left: 0;
  right: 0;
  height: 120dvh;
  padding: 2rem;
  overflow: hidden;
  z-index: 10;
`;

const CardContainer = styled.div`
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  position: sticky;
  top: 20dvh;
  height: 80dvh;
`;

const Card = styled(motion.div)`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (min-width: 1080px) {
    width: calc((100% - 40px) / 3);
  }

  @media (min-width: 1920px) {
    width: calc((100% - 60px) / 4);
  }
`;

const CardImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// const ScrollIndicator = styled(motion.div)`
//   position: fixed;
//   right: 20px;
//   top: 50%;
//   width: 4px;
//   height: 100px;
//   background-color: #ddd;
//   border-radius: 2px;
//   z-index: 3;
// `;

// const ScrollThumb = styled(motion.div)`
//   width: 100%;
//   background-color: #888;
//   border-radius: 2px;
// `;

// const AnimatedBackground = styled(motion.div)`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   z-index: 1;
// `;

const TemplateShowcase: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);
  // 計算滾動進度，避免重新染
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  // useScroll 監聽Scroll 目標元素containerRef

  // Create a transform for the move
  const yOffsetUp = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yOffsetDown = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  // [0, 1], [100, -100] 向上移動 200px

  // Create a transform for the opacity
  const imageOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1920) {
        setVisibleCards(4);
      } else if (window.innerWidth >= 1080) {
        setVisibleCards(3);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ShowcaseContainer ref={containerRef}>
      <CardContainer>
        {cardImages.slice(0, visibleCards).map((image, index) => (
          <Card
            key={index}
            style={{
              y: index % 2 === 0 ? yOffsetUp : yOffsetDown,
            }}
            whileHover={{ scale: 1.05 }}
            // 點擊卡片时，卡片會縮小
          >
            <CardImage
              src={image}
              alt={`Template ${index + 1}`}
              style={{ opacity: imageOpacity }}
            />
          </Card>
        ))}
      </CardContainer>
      {/* <ScrollIndicator>
        <ScrollThumb style={{ scaleY: scrollYProgress }} />
      </ScrollIndicator> */}
    </ShowcaseContainer>
  );
};

export default TemplateShowcase;
