import type React from "react";
import type { TabPaneProps } from "./Tabs";

const TabPane: React.FC<TabPaneProps> = ({ children }) => {
  return <div className="p-3">{children}</div>;
};

export default TabPane;
