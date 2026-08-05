"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader/Loader";

type Props = {
  children: React.ReactNode;
};

export default function AppLoaderProvider({ children }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loader />;
  }

  return <>{children}</>;
}
