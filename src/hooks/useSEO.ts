"use client";

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
}

const useSEO = ({ title, description }: SEOProps) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | NEC Travels`;
    }
    if (description) {
      const meta = document.querySelector("meta[name='description']");
      if (meta) {
        meta.setAttribute("content", description);
      }
    }
  }, [title, description]);
};

export default useSEO;
