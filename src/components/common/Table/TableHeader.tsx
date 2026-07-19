import React from "react";
import SearchQuery from "@/components/common/SearchQuery/SearchQuery";

interface TableHeaderProps {
  title?: string;
  isSelect?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({ title, isSelect }) => {
  return (
    <div className="md:flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-0">
        {title ?? ""}
      </h1>
      <SearchQuery isSelect={isSelect} />
    </div>
  );
};

export default TableHeader;
