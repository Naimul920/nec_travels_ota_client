import React from "react";
import { Button } from "@/components/ui";
// 1. Next.js 16 Image component for layout performance and asset compression optimization
import Image from "next/image";

type NotFoundProps = {
  title: string;
  description?: string;
  image?: string;
  showReload?: boolean;
  onReload?: () => void;
};

const NotFound: React.FC<NotFoundProps> = ({
  title,
  description,
  image = "/assets/images/flight.png",
  showReload = false,
  onReload,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] px-6">
      {/* Image */}
      <div className="mb-6 flex items-center justify-center w-full">
        {/* 2. Swapped HTML <img> for Next.js <Image /> */}
        <Image
          src={image}
          alt="Flight Issue"
          width={500} // Target resolution width base parameter mapping
          height={300} // Target resolution height base parameter mapping
          draggable={false}
          className="md:w-2/4 h-auto opacity-90 object-contain"
          priority // Prioritizes loading if used as a primary fallback view screen
        />
      </div>

      {/* Text */}
      <div className="text-center max-w-md">
        <h1 className="text-lg md:text-3xl font-bold text-primary">{title}</h1>

        {description && (
          <p className="mt-2 text-xs text-secondary">{description}</p>
        )}
      </div>

      {showReload && (
        <div className="mt-6">
          <Button
            onClick={onReload}
            className="px-6 py-2 bg-primary hover:bg-primary/90
              text-white rounded-lg shadow-md transition"
          >
            Reload
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotFound;
