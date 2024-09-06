"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import FrostedLiquidButton from "./FrostedLiquidButton";
import dynamic from "next/dynamic";

const BackgroundLines = dynamic(() => import("./BackgroundLines"), {
  ssr: false,
  loading: () => <div style={{ height: "100%", width: "100%" }}></div>,
});

const HeroContainer = styled.section`
  height: 90dvh;
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

const words = ["網站", "夢想", "創意", "未來"];

const HeroSection: React.FC = () => {
  // 定義狀態來跟踪當前顯示的單詞索引
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    // 設置一個定時器，每3秒更換顯示的單詞
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length); // 更新當前單詞索引，循環顯示
    }, 3000); // 3秒後更新單詞

    // 清除定時器以防止內存洩漏
    return () => clearInterval(interval);
  }, []); // 空依賴數組，僅在組件首次渲染時設置定時器

  return (
    <HeroContainer>
      {/* 背景線條裝飾 */}
      <BackgroundLines />
      <ContentWrapper>
        {/* 顯示標題，初始時不透明度為0並向上偏移50px，動畫中不透明度設為1並回到原位置 */}
        <Title
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Designare
        </Title>
        <Subtitle>
          {/* 顯示副標題，包含動畫效果的單詞 */}
          將您的
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWord} // 使用當前單詞的索引作為唯一鍵
              initial={{ opacity: 0, y: 20 }} // 初始狀態，不透明度為0，向下偏移20px
              animate={{ opacity: 1, y: 0 }} // 動畫狀態，不透明度設為1，回到原位置
              exit={{ opacity: 0, y: -20 }} // 離開時狀態，不透明度為0，向上偏移20px
              transition={{ duration: 0.3 }} // 動畫持續時間為0.3秒
            >
              {" "}
              {words[currentWord]} {/* 當前顯示的單詞 */}
            </motion.span>
          </AnimatePresence>{" "}
          變為現實
        </Subtitle>
        {/* 顯示一個透明度效果的按鈕 */}
        <FrostedLiquidButton />
      </ContentWrapper>
    </HeroContainer>
  );
};

export default HeroSection;
