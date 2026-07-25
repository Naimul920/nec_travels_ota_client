"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader/Loader";

// import Loader from "@/components/common/Loader";

type Props = {
  children: React.ReactNode;
};

export default function AppLoaderProvider({ children }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Change the duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
}
