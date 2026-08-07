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

export const NotFound: React.FC<NotFoundProps> = ({
  statusCode,
  title,
  description,
  image,
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
        "relative flex w-full flex-col items-center justify-center overflow-hidden px-4 py-12 text-center sm:px-6 md:py-20",
        className ?? "min-h-[70vh]"
      )}
    >
      {/* Background Subtle Accent Blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Image Display */}
      {image && (
        <div className="relative mb-6 flex w-full max-w-sm items-center justify-center">
          <Image
            src={image}
            alt="Not Found Illustration"
            width={400}
            height={260}
            draggable={false}
            className="h-auto w-auto object-contain transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>
      )}

      {/* Status Code with Gradient Styling */}
      {statusCode && (
        <div className="relative select-none">
          <span className="bg-gradient-to-b from-primary via-primary/80 to-primary/40 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
            {statusCode}
          </span>
          <div className="mx-auto -mt-4 w-max rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Error
          </div>
        </div>
      )}

      {/* Title & Description Container */}
      <div className="mt-6 max-w-lg space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-gray-500 sm:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {hasActions && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {showReload && (
            <Button
              onClick={onReload}
              className="h-11 px-6 font-medium bg-primary text-white hover:bg-primary/90 shadow-sm transition-all hover:shadow hover:-translate-y-0.5 rounded-lg"
            >
              Reload Page
            </Button>
          )}

          {showBack && (
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="h-11 px-6 font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all hover:-translate-y-0.5 rounded-lg"
            >
              Go Back
            </Button>
          )}

          {showHome && (
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NotFound;