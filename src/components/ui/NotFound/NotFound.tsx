"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui";

interface NotFoundProps {
  statusCode?: number;
  title: string;
  description?: string;
  image?: string;
  showBack?: boolean;
  showHome?: boolean;
  showReload?: boolean;
  onReload?: () => void;
  className?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  statusCode,
  title,
  description,
  image = "/assets/images/flight.png",
  showBack = false,
  showHome = false,
  showReload = false,
  onReload,
  className,
}) => {
  const router = useRouter();

  const hasActions = showBack || showHome || showReload;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center px-6 text-center",
        className ?? "min-h-[60vh]",
      )}
    >
      {statusCode && (
        <h1 className="text-7xl md:text-8xl font-extrabold text-primary select-none">
          {statusCode}
        </h1>
      )}

      {image && !statusCode && (
        <div className="mb-6 flex items-center justify-center w-full">
          <Image
            src={image}
            alt="Not Found"
            width={500}
            height={300}
            draggable={false}
            className="md:w-2/4 h-auto opacity-90 object-contain"
            priority
          />
        </div>
      )}

      <div className="max-w-md">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-xs md:text-sm text-gray-500">{description}</p>
        )}
      </div>

      {hasActions && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {showReload && (
            <Button
              onClick={onReload}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md transition"
            >
              Reload
            </Button>
          )}

          {showBack && (
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 transition hover:bg-gray-100"
            >
              Go Back
            </Button>
          )}

          {showHome && (
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Go Home
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NotFound;
