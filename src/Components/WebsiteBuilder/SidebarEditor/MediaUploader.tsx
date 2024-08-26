import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import styled from "styled-components";
import { Button } from "@/src/Components/Button";

// 定義 MediaUploader 組件的屬性
interface MediaUploaderProps {
  value?: { type: string; url: string };
  onChange: (value: { type: string; url: string }) => void; // 媒體內容變更時的回調函數
  accept: string; // 允許上傳的檔案類型
  maxSize: number; // 允許的最大檔案大小（以位元組為單位）
}
interface UploadAreaProps {
  $dragActive: boolean;
}

const OrText = styled.span`
  margin: 10px 0;
`;

// 上傳區域的樣式
const UploadArea = styled.div<UploadAreaProps>`
  border: 2px dashed ${(props) => props.theme.colors.border};
  border-radius: 4px;
  padding:1rem;
  text-align: center; // 文字置中
  cursor: pointer; // 鼠標樣式為點擊
  border-color:
    ${(props) =>
      props.$dragActive
        ? props.theme.colors.accentBorder
        : props.theme.colors.border};
  &:hover {
    border-color: ${(props) => props.theme.colors.accentBorder}
`;

// 媒體預覽區域的樣式
const Preview = styled.div`
  margin-top: 0.8rem;
  position: relative;
  width: 100%;
  max-width: 18.75 rem; // 300px
  height: 12.5rem; // 200px
`;

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 4px solid ${(props) => props.theme.colors.border};
  border-radius: 50%;
  border-top: 4px solid ${(props) => props.theme.colors.accentBorder};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// MediaUploader 組件
const MediaUploader: React.FC<MediaUploaderProps> = ({
  value,
  onChange,
  accept,
  maxSize,
}) => {
  // 記錄拖曳狀態
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理拖曳事件
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); // 防止默認行為
    e.stopPropagation(); // 防止事件冒泡
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true); // 設定拖曳進入狀態
    } else if (e.type === "dragleave") {
      setDragActive(false); // 設定拖曳離開狀態
    }
  }, []);

  // 處理檔案的實際上傳和檢查
  const handleFiles = useCallback(
    (files: FileList) => {
      setLoading(true);
      const file = files[0];
      if (file.size > maxSize) {
        alert(`檔案大小不能超過 ${maxSize / 1000000}MB`); // 檔案過大提示
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoading(false);
        onChange({
          type: file.type.startsWith("image/") ? "image" : "video", // 根據檔案類型設定類別
          url: reader.result as string, // 設定檔案的 URL
        });
      };
      reader.readAsDataURL(file); // 讀取檔案為 Data URL
    },
    [maxSize, onChange]
  );

  // 處理檔案丟棄事件
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault(); // 防止默認行為
      e.stopPropagation(); // 防止事件冒泡
      setDragActive(false); // 重置拖曳狀態
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files); // 處理拖曳上傳的檔案
      }
    },
    [handleFiles]
  );

  // 處理檔案選擇變更事件
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <UploadArea
        $dragActive={dragActive}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept} // 允許上傳的檔案類型
          onChange={handleChange} // 處理檔案選擇事件
          style={{ display: "none" }} // 隱藏檔案選擇框
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button onClick={handleButtonClick} type="button">
            點擊上傳
          </Button>
          <OrText>或者</OrText>
          <span>拖曳檔案到此處</span>
        </label>{" "}
        {loading && <Loader />}
      </UploadArea>
      {value && value.url && (
        <>
          <p>檔案預覽</p>
          <Preview>
            {value.type === "image" ? (
              <Image
                src={value.url}
                alt="預覽"
                layout="fill"
                objectFit="contain"
              />
            ) : (
              <video
                src={value.url}
                controls
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </Preview>
        </>
      )}
    </>
  );
};

export default MediaUploader;
