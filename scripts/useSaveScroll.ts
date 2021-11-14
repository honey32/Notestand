import { useCallback, useRef } from "react";
import { getScrollOriginElement } from "../tags/utils";

export const useScrollSave = () => {
  const scrollValue = useRef(0);
  const id = useRef(0);

  const startObservation = useCallback(() => {
    const scrollOriginElement = getScrollOriginElement();
    const anime = () => {
      scrollValue.current = scrollOriginElement?.scrollTop;
      id.current = requestAnimationFrame(anime);
    };
    setTimeout(anime, 1000);
  }, []);

  const stopObservation = useCallback(() => {
    cancelAnimationFrame(id.current);
  }, []);

  const restore = useCallback(() => {
    const scrollOriginElement = getScrollOriginElement();
    requestAnimationFrame(() => {
      scrollOriginElement.scrollTop = scrollValue.current;
    });
  }, []);

  return {
    startObservation,
    stopObservation,
    restore,
  };
};
