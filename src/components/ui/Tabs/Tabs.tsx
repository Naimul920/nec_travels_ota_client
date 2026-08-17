import * as React from "react";
import clsx from "clsx";
import Button from "../Button/Button";

export interface TabPaneProps {
  key: string;
  tab: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  activeKey: string;
  onChange: (key: string) => void;
  children: React.ReactElement<TabPaneProps>[];
  className?: string;
  containerClassName?: string;
  floating?: boolean;
  isPending?: boolean;
}
 

const Tabs: React.FC<TabsProps> = ({
  activeKey,
  onChange,
  children,
  className,
  containerClassName,
  floating = false,
  isPending = false,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      <div
        className={clsx(
          "relative z-10 w-full flex md:justify-center",
          floating && "-mt-2 md:-mt-3 -translate-y-1/2"
        )}
      >
        <div
          className={clsx(
            "flex items-center justify-start md:justify-center rounded-md border border-gray-200 bg-white p-1.5 pb-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_16px_rgba(15,35,61,0.08)] overflow-x-auto overflow-y-clip flex-nowrap custom-scrollbar snap-x snap-proximity overscroll-x-contain touch-pan-x min-w-0 md:snap-none",
            floating && "min-h-12 md:min-h-14",
            containerClassName
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
                "flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-6 md:py-3 text-xs md:text-base font-semibold transition-all duration-300 rounded-full whitespace-nowrap shrink-0 snap-start",
                isActive
                  ? "bg-brand text-white shadow-lg shadow-brand/30"
                  : "bg-transparent text-slate-700! hover:text-slate-900! hover:bg-gray-100!",
                isDisabled &&
                  "opacity-40 cursor-not-allowed pointer-events-none grayscale"
              )}
              disabled={isDisabled}
            >
              {child.props.icon && (
                <span
                  className={clsx(
                    "text-base md:text-xl",
                    isActive ? "text-white" : "text-emerald-600"
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
      </div>

      <div className={clsx("w-full", floating ? "-mt-4 md:-mt-3" : "mt-2 md:mt-4")}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          if (child.key !== activeKey) return null;
          return (
            <div
              key={activeKey}
              className={clsx(
                "animate-tab-fade-up transition-opacity duration-300",
                isPending && "opacity-60"
              )}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
