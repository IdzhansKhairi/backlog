"use client";

import React, { useState, useEffect } from "react";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  containerClassName?: string;
  overlayStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
}

export default function AnimatedModal({
  isOpen,
  onClose,
  children,
  overlayClassName = "modal-overlay",
  containerClassName = "modal-container",
  overlayStyle,
  containerStyle,
}: AnimatedModalProps) {
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
      }, 250); // Matches the 0.25s animation duration in CSS
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  if (!isRendered) return null;

  return (
    <div
      className={`${overlayClassName} ${isClosing ? "closing" : ""}`}
      style={overlayStyle}
      onClick={onClose}
    >
      <div
        className={`${containerClassName} ${isClosing ? "closing" : ""}`}
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
