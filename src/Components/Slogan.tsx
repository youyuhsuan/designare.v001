"use client";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  50% { border-color: transparent; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const SloganContainer = styled.div`
  font-family: "Courier New", monospace;
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
  background-color: #f0f0f0;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const CodeLine = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #333;
  animation: ${typewriter} 3s steps(40, end) forwards,
    ${blink} 0.5s step-end infinite alternate;
`;

const Output = styled.div`
  font-size: 2rem;
  color: #0070f3;
  font-weight: bold;
  opacity: 0;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: 3s;
  animation-fill-mode: forwards;
`;

const Button = styled.button`
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0050a0;
  }
`;

export default function Slogan() {
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowOutput(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SloganContainer>
      <CodeLine>dream.toWebsite()</CodeLine>
      {showOutput && <Output>夢想 → 現實</Output>}
      <Button onClick={() => alert("開始創建您的網站!")}>立即开始</Button>
    </SloganContainer>
  );
}
