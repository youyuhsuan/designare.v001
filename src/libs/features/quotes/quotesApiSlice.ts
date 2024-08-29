// 需要使用專門針對 React 的入口點來導入 `createApi`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 定義 `Quote` 接口，表示單個名言的結構
interface Quote {
  id: number;
  quote: string;
  author: string;
}

// 定義 `QuotesApiResponse` 接口，表示 API 返回的名言列表的結構
interface QuotesApiResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}

// 定義一個服務，使用基本 URL 和預期的端點
export const quotesApiSlice = createApi({
  // 基本查詢配置，設置 API 的基礎 URL
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/quotes" }),
  // 設置 reducer 路徑，這是用於該 API 的 state 在 Redux store 中的路徑
  reducerPath: "quotesApi",
  // 標籤類型用於緩存和失效處理
  tagTypes: ["Quotes"],
  endpoints: (build) => ({
    // 為 `getQuotes` 端點定義泛型，其中 `QuotesApiResponse` 是返回的數據類型
    // 第二個泛型參數是預期的查詢參數類型。如果沒有參數，則使用 `void`
    getQuotes: build.query<QuotesApiResponse, number>({
      // 查詢函數，`limit` 默認為 10，將其作為查詢參數傳遞
      query: (limit = 10) => `?limit=${limit}`,
      // `providesTags` 用於確定哪個標籤與查詢返回的緩存數據相關聯
      providesTags: (result, error, id) => [{ type: "Quotes", id }],
    }),
  }),
});

// RTK-Query 自動生成的 Hooks
// `useGetQuotesQuery` 與 `quotesApiSlice.endpoints.getQuotes.useQuery` 相同
export const { useGetQuotesQuery } = quotesApiSlice;
