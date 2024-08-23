"use client";

import Link from "next/link";
import { Button } from "@/src/Components/Button";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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

const ButtonLink = styled(Link)`
  text-decoration: none;
`;

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

export default FrostedLiquidButton;
