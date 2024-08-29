import { Suspense } from "react";
import dynamic from "next/dynamic";
import Loading from "@/src/Components/Loading/LoadingPage";

// 動態加載 HeavyClientComponent 組件，並設置加載狀態組件為 Loading
const BackgroundLines = dynamic(
  () => import("@/src/Components/BackgroundLines"),
  {
    loading: () => <Loading />,
  }
);

export default function ClientSidePage() {
  return (
    // 使用 Suspense 處理 DynamicComponent 的加載狀態
    // 在 DynamicComponent 加載時顯示 Loading
    <Suspense fallback={<Loading />}>
      <BackgroundLines />
    </Suspense>
  );
}
