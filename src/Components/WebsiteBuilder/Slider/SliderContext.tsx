"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { v4 } from "uuid";
import {
  useElementContext,
  SliderElement,
} from "@/src/Components/WebsiteBuilder/ElementContext";

interface SliderContextType
  extends Omit<SliderElement, "id" | "type" | "name"> {
  addSlide: (content: string) => void;
  updateSlide: (id: string, content: string) => void;
  deleteSlide: (id: string) => void;
  updateSliderProperties: (
    updates: Partial<Omit<SliderElement, "id" | "type" | "name" | "slides">>
  ) => void;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const SliderProvider: React.FC<{
  children: ReactNode;
  sliderId: string;
  sectionId: string;
  initialState: SliderElement;
}> = ({ children, sliderId, sectionId, initialState }) => {
  const [state, setState] = useState<SliderElement>(initialState);
  const { updateElementInSection, updateSliderPropertiesInSection } =
    useElementContext();

  const updateSlidesInSection = useCallback(
    (newSlides: { id: string; content: string }[]) => {
      updateElementInSection(sectionId, sliderId, { slides: newSlides });
    },
    [sectionId, sliderId, updateElementInSection]
  );

  const addSlide = useCallback(
    (content: string) => {
      const newSlide = { id: v4(), content };
      setState((prev) => {
        const newSlides = [...prev.slides, newSlide];
        updateSlidesInSection(newSlides);
        return { ...prev, slides: newSlides };
      });
    },
    [updateSlidesInSection]
  );

  const updateSlide = useCallback(
    (id: string, content: string) => {
      setState((prev) => {
        const newSlides = prev.slides.map((slide) =>
          slide.id === id ? { ...slide, content } : slide
        );
        updateSlidesInSection(newSlides);
        return { ...prev, slides: newSlides };
      });
    },
    [updateSlidesInSection]
  );

  const deleteSlide = useCallback(
    (id: string) => {
      setState((prev) => {
        const newSlides = prev.slides.filter((slide) => slide.id !== id);
        updateSlidesInSection(newSlides);
        return { ...prev, slides: newSlides };
      });
    },
    [updateSlidesInSection]
  );

  const updateSliderProperties = useCallback(
    (
      updates: Partial<Omit<SliderElement, "id" | "type" | "name" | "slides">>
    ) => {
      setState((prev) => {
        const newState = { ...prev, ...updates };
        updateSliderPropertiesInSection(sectionId, sliderId, updates);
        return newState;
      });
    },
    [sectionId, sliderId, updateSliderPropertiesInSection]
  );

  return (
    <SliderContext.Provider
      value={{
        ...state,
        addSlide,
        updateSlide,
        deleteSlide,
        updateSliderProperties,
      }}
    >
      {children}
    </SliderContext.Provider>
  );
};

export const useSliderContext = () => {
  const context = useContext(SliderContext);
  if (!context) {
    throw new Error("useSliderContext must be used within a SliderProvider");
  }
  return context;
};
