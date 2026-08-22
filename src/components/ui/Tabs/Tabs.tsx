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
          "relative z-10 flex w-full justify-start md:justify-center",
          floating && "-translate-y-[65%]"
        )}
      >
        <div
          role="tablist"
          aria-label="Travel services"
          className={clsx(
            "flex min-w-0 flex-nowrap items-center justify-start gap-1 overflow-x-auto overflow-y-hidden rounded-2xl border border-slate-200 bg-slate-50 p-1.5 custom-scrollbar snap-x snap-proximity overscroll-x-contain touch-pan-x md:justify-center md:snap-none",
            floating && "shadow-[0_10px_30px_-24px_rgba(15,35,61,0.35)]",
            containerClassName
          )}
        >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;

          const isActive = child.key === activeKey;
          const isDisabled = child.props.disabled;

          return (
            <Button
              role="tab"
              aria-selected={isActive}
              onClick={() => !isDisabled && onChange(child.key as string)}
              className={clsx(
                "flex h-10 shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-xl px-3 text-xs font-semibold transition-all duration-200 md:h-11 md:gap-2 md:px-5 md:text-sm",
                isActive
                  ? "bg-brand text-white shadow-sm shadow-brand/25"
                  : "bg-transparent text-slate-600! hover:bg-white! hover:text-[#12233D]!",
                isDisabled &&
                  "opacity-40 cursor-not-allowed pointer-events-none grayscale"
              )}
              disabled={isDisabled}
            >
              {child.props.icon && (
                <span
                  className={clsx(
                    "text-base md:text-lg",
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

      <div className={clsx("w-full", floating ? "-mt-8" : "mt-4")}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          if (child.key !== activeKey) return null;
          return (
            <div
              key={activeKey}
              role="tabpanel"
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
