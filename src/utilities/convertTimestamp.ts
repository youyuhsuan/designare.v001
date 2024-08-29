import { Timestamp } from "firebase/firestore";

export interface SerializedTimestamp {
  seconds: number;
  nanoseconds: number;
}

export const convertTimestamp = (timestamp: Timestamp) => ({
  seconds: timestamp.seconds,
  nanoseconds: timestamp.nanoseconds,
});

export const formatTimestamp = (
  timestamp: { seconds: number; nanoseconds: number } | Date | null | undefined
): string => {
  if (
    timestamp &&
    typeof timestamp === "object" &&
    "seconds" in timestamp &&
    "nanoseconds" in timestamp
  ) {
    // 處理 { seconds, nanoseconds } 對象
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return date.toLocaleString(); // 將日期轉換為本地化的字串格式
  } else if (timestamp instanceof Date) {
    // 處理 Date 對象
    return timestamp.toLocaleString(); // 將日期轉換為本地化的字串格式
  } else if (timestamp === null || timestamp === undefined) {
    // 處理 null 或 undefined
    return "N/A"; // 返回 "N/A" 以表示無可用日期
  } else {
    // 處理無效的格式
    console.error("Invalid timestamp format:", timestamp); // 記錄錯誤資訊
    return "Invalid Date"; // 返回 "Invalid Date" 以表示日期無效
  }
};
