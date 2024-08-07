"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const KeyFeaturesContainer = styled.section`
  background-color: ${(props) => props.theme.colors.tertiary};
  height: 80dvh;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 1.6rem;
  color: ${(props) => props.theme.colors.primary};
`;

export default function KeyFeaturesSection() {
  return (
    <KeyFeaturesContainer>
      <Title>使用者界面簡單</Title>
      <pre>
        透過拖放或分層應用程序組件來建立網站或內容，
        即使是沒有程式碼經驗的使用者也能輕鬆上手。
        設計師只需要了解基本的操作，就能快速創建專業外觀的網站。
      </pre>
      <Title>開發速度更快</Title>
      <pre>
        無需繁瑣的編碼過程，意味著可以更迅速地構建和啟動網站。這不僅節省了時間，也使得產品能夠更快地推向市場，加快了業務的推進速度。
      </pre>
      <Title>更低的花費</Title>
      <pre>
        無程式碼工具為外行網頁設計師及專業網站工程師之間架起了橋樑，節省了學習和開發成本。這使得使用者能夠以較低的成本實現高質量的設計和功能，降低了整體開發花費。
      </pre>
    </KeyFeaturesContainer>
  );
}
