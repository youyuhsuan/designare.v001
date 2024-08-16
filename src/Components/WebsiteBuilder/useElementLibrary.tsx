import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addToElementLibrary } from "@/src/libs/features/websiteBuilder/websiteBuilderSlice"; // 假設你有這個 action creator
import { GlobalElementType } from "@/src/Components/WebsiteBuilder/BuilderInterface";

export const useElementLibrary = () => {
  const dispatch = useDispatch();

  const addElementLibrary = (globalElement: Omit<GlobalElementType, "id">) => {
    const newElement: GlobalElementType = {
      ...globalElement,
    };
    dispatch(addToElementLibrary(newElement));
  };

  return { addElementLibrary };
};
