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
}
 

const Tabs: React.FC<TabsProps> = ({
  activeKey,
  onChange,
  children,
  className,
  containerClassName,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      <div
        className={clsx(
          "flex items-center bg-white border border-gray-100 rounded-lg md:rounded-xl overflow-x-auto flex-nowrap no-scrollbar shadow-xs p-1",
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
                "flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 rounded-md md:rounded-lg whitespace-nowrap shrink-0",
                isActive
                  ? "bg-secondary border-primary text-white shadow-sm"
                  : "bg-transparent text-gray-600! hover:text-gray-900 hover:bg-gray-50",
                isDisabled &&
                  "opacity-40 cursor-not-allowed pointer-events-none grayscale"
              )}
              disabled={isDisabled}
            >
              {child.props.icon && (
                <span
                  className={clsx(
                    "text-lg md:text-xl",
                    isActive ? "text-white" : "text-green-600"
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

      <div className="mt-2 md:mt-4 w-full">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          return child.key === activeKey ? child : null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
