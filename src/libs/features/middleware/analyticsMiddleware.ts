import { Middleware, AnyAction } from "redux";

// 定义一个通用的 Action 类型
interface Action extends AnyAction {
  type: string;
  payload?: any;
}

export const analyticsMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const typedAction = action as Action;
    if (
      typeof typedAction.type === "string" &&
      typedAction.type.startsWith("elementLibrary/")
    ) {
      console.log(
        "Element Library Action:",
        typedAction.type,
        typedAction.payload
      );
      // 在这里你可以调用你的分析服务
      // analytics.track(typedAction.type, typedAction.payload);
    }
    return next(action);
  };
