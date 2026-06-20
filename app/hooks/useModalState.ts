import { useState, useEffect } from "react";

export function useModalState(isOpen: boolean, delay: number = 250) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered, delay]);

  return { isRendered, isClosing };
}
