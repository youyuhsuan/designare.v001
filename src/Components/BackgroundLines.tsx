"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { FixedSizeGrid as Grid, GridChildComponentProps } from "react-window";
import { motion } from "framer-motion";
import styled from "styled-components";

const Line = styled(motion.div)`
  width: 60%;
  height: 3px;
  background-color: ${(props) => props.theme.colors.accent};
  transform-origin: center center; // 旋轉原點設置在中心
  position: absolute;
  top: 50%;
`;

const LineContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const BackgroundLines = () => {
  // 用於追蹤鼠標位置的狀態
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // 用於追蹤窗口大小的狀態
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // 用於 requestAnimationFrame 的引用
  const rafId = useRef(0);

  // 使用 requestAnimationFrame 來更新鼠標位置
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    rafId.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  // 用於處理窗口大小變化的回調函數
  const handleResize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleMouseMove, handleResize]);

  // 記憶化的單元格大小計算
  const cellSize = useMemo(
    () => ({
      width: windowSize.width / 15,
      height: windowSize.height / 15,
    }),
    [windowSize]
  );

  // 渲染每個單元格的回調函數
  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
      // 計算單元格的中心位置
      const centerX = (columnIndex + 0.5) * cellSize.width;
      const centerY = (rowIndex + 0.5) * cellSize.height;
      // 根據鼠標位置計算行的旋轉角度
      const angle = Math.atan2(
        mousePosition.y - centerY,
        mousePosition.x - centerX
      );

      return (
        <div style={style}>
          <Line
            animate={{ rotate: angle * (180 / Math.PI) }} // 根據計算的角度旋轉行
            transition={{ type: "spring", stiffness: 200, damping: 20 }} // 設置動畫過渡效果
          />
        </div>
      );
    },
    [mousePosition, cellSize]
  );

  return (
    <LineContainer>
      <Grid
        columnCount={15}
        columnWidth={cellSize.width}
        height={windowSize.height}
        rowCount={15}
        rowHeight={cellSize.height}
        width={windowSize.width}
      >
        {Cell}
      </Grid>
    </LineContainer>
  );
};

export default BackgroundLines;
