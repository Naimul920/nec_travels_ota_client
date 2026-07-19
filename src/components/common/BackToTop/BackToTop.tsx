"use client";

import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "@/components/ui";

interface ScrollState {
  lastScroll: number;
}

interface BackToTopProps {
  state: ScrollState;
  scrollRef: React.RefObject<HTMLElement | null>;
}

const BackToTop: React.FC<BackToTopProps> = ({ state, scrollRef }) => {
  const [docHeight, setDocHeight] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateDocHeight = () => {
      setDocHeight(el.scrollHeight - el.clientHeight);
    };

    updateDocHeight();
    window.addEventListener("resize", updateDocHeight);

    return () => {
      window.removeEventListener("resize", updateDocHeight);
    };
  }, [scrollRef]);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Check if scrolled past 10% of total height
  const isTenPercent = docHeight > 0 && state.lastScroll / docHeight > 0.1;
  const isVisible = state.lastScroll >= 600 || isTenPercent;

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-20 right-6 z-50 h-12 w-12 custom-rounded animate-bounce bg-secondary hover:bg-secondary/95 text-white p-3 shadow-lg transition-opacity duration-300"
      aria-label="Back to top"
    >
      <FaArrowUp size={20} />
    </Button>
  );
};

export default BackToTop;
