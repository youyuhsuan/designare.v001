"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styled from "styled-components";

// 預設的圖片數組
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
  height: 160dvh;
  padding: 2rem;
  z-index: 10;
`;

const CardContainer = styled.div`
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  position: sticky;
  top: 50%;
  transform: translateY(-50%);
  height: 40vh;
  margin: 0 auto;
`;

const Card = styled(motion.div)`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px ${(props) => props.theme.colors.shadow};
  @media (max-width: 1440px) {
    max-width: 200px;
  }
`;

const CardImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TemplateShowcase: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<number>(4);
  const [isClient, setIsClient] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 計算滾動進度
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Create a transform for the move
  const yOffsetUp = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yOffsetDown = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  // Create a transform for the opacity
  const imageOpacity = useTransform(
    scrollYProgress,
    [0, 0, 0.5, 0.9, 1],
    [0, 0, 0.9, 1, 1]
  );

  useEffect(() => {
    setIsClient(true); // 設置為客戶端
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

  if (!isClient) {
    return null; // 在伺服器端不渲染任何內容
  }

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
          >
            <CardImage
              src={image}
              alt={`Template ${index + 1}`}
              style={{ opacity: imageOpacity }}
            />
          </Card>
        ))}
      </CardContainer>
    </ShowcaseContainer>
  );
};

export default TemplateShowcase;
