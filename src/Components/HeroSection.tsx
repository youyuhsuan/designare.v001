"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/src/Components/Button";
import BackgroundLines from "@/src/Components/BackgroundLines";

const HeroContainer = styled.section`
  height: 90dvh;
  padding: 2%;
  background: ${(props) => props.theme.colors.background};
  overflow: hidden;
  position: relative;
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 5%;
  left: 10%;
  color: ${(props) => props.theme.colors.accent};
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
`;

const Subtitle = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled(motion(Button))`
  position: relative;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 50px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: 0 4px 6px ${(props) => props.theme.colors.shadow};
`;

const ButtonText = styled(motion.span)`
  position: relative;
  z-index: 2;
  mix-blend-mode: difference;
`;

const LiquidBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.button.background.primary};
  backdrop-filter: blur(5px);
  border-radius: 50px;
`;

const ArrowIcon = styled(motion.span)`
  display: inline-block;
  margin-left: 10px;
`;

const LineContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(20, 1fr);
`;

const Line = styled(motion.div)`
  width: 60%;
  height: 3px;
  background-color: ${(props) => props.theme.colors.accent};
  transform-origin: center center;
`;

const ButtonLink = styled(Link)`
  text-decoration: none;
`;

// const BackgroundLines: React.FC = () => {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     const handleResize = () => {
//       setWindowSize({ width: window.innerWidth, height: window.innerHeight });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("resize", handleResize);

//     handleResize(); // 初始化窗口大小

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <LineContainer>
//       {Array.from({ length: 20 * 20 }).map((_, i) => {
//         const row = Math.floor(i / 20);
//         const col = i % 20;
//         const centerX = ((col + 0.5) / 20) * windowSize.width;
//         const centerY = ((row + 0.5) / 20) * windowSize.height;

//         return (
//           <Line
//             key={i}
//             animate={{
//               rotate:
//                 Math.atan2(
//                   mousePosition.y - centerY,
//                   mousePosition.x - centerX
//                 ) *
//                 (180 / Math.PI),
//             }}
//             transition={{ type: "spring", stiffness: 100, damping: 10 }}
//           />
//         );
//       })}
//     </LineContainer>
//   );
// };

const FrostedLiquidButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ButtonLink href="/dashboard">
      <ButtonContainer
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.95 }}
      >
        <LiquidBackground
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? 0 : "-100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
        />
        <ButtonText>
          開始設計
          <ArrowIcon
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.2 }}
          >
            →
          </ArrowIcon>
        </ButtonText>
      </ButtonContainer>
    </ButtonLink>
  );
};

const words = ["網站", "夢想", "創意", "未來"];

const HeroSection: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HeroContainer>
      <BackgroundLines />
      <ContentWrapper>
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Designare
        </Title>
        <Subtitle>
          將您的
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWord}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {" "}
              {words[currentWord]}
            </motion.span>
          </AnimatePresence>{" "}
          變為現實
        </Subtitle>
        <FrostedLiquidButton />
      </ContentWrapper>
    </HeroContainer>
  );
};

export default HeroSection;
