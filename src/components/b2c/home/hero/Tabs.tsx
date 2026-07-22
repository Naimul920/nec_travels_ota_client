"use client";

import * as React from "react";
import clsx from "clsx";
import Button from "@/components/ui/Button/Button";

export interface TabPaneProps {
  key: string;
  tab: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  activeKey: string | null;
  onChange: (key: string) => void;
  children: React.ReactElement<TabPaneProps>[];
  className?: string;
  containerClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  activeKey,
  onChange,
  children,
  className,
  containerClassName,
}) => {
  return (
    <div className={clsx("relative w-full", className)}>
      {/* Anchored Tab Bar */}
      <div
        className={clsx(
          "flex items-center bg-primary   rounded-t-4xl  overflow-x-auto flex-nowrap no-scrollbar shadow-xl p-3 px- z-20 relative",
          containerClassName,
        )}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;

          const isActive = child.key === activeKey;
          const isDisabled = child.props.disabled;

          return (
            <Button
              onClick={() => !isDisabled && onChange(child.key as string)}
              className={clsx(
                "flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 rounded-md md:rounded-lg whitespace-nowrap shrink-0 cursor-pointer",
                isActive
                  ? "bg-secondary border-primary text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                isDisabled &&
                  "opacity-40 cursor-not-allowed pointer-events-none grayscale",
              )}
              disabled={isDisabled}
            >
              {child.props.icon && (
                <span
                  className={clsx(
                    "text-lg md:text-xl",
                    isActive ? "text-white" : "text-green-600",
                  )}
                >
                  {child.props.icon}
                </span>
              )}
              {child.props.tab}
            </Button>
          );
        })}
      </div>

      {/* 
        Slide-down Panel Body:
        We use `overflow-visible` when active so the floating Search button can extend past the bottom edge.
      */}
      <div
        className={clsx(
          "absolute left-0 right-0 top-[calc(100%+8px)] bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out z-10",
          activeKey
            ? "max-h-[600px] opacity-100 pointer-events-auto p-6 pb-10 overflow-visible"
            : "max-h-0 opacity-0 pointer-events-none p-0 overflow-hidden border-0",
        )}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return child.key === activeKey ? child : null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
