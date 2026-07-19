"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useState, useEffect } from "react";
import { Input } from "antd";
// 2. Swapped React Router hooks with Next.js App Router hooks
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SelectSearch from "@/components/common/SearchQuery/SelectSearch";

const { Search } = Input;

interface SearchQueryProps {
  isSelect?: boolean;
}

const SearchQuery: React.FC<SearchQueryProps> = ({ isSelect = false }) => {
  // 3. Initialized Next.js 16 navigation engines
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  // 4. Keeps the local state in sync if the URL search parameter changes externally
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const updateSearchParam = (value: string) => {
    // 5. Create a mutable instance from the read-only Next.js searchParams hook
    const newParams = new URLSearchParams(searchParams.toString());

    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }

    // 6. Push the updated query state to the active route path location
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = (value: string) => {
    updateSearchParam(value);
  };

  return (
    <div className="md:flex items-center gap-2">
      {isSelect && <SelectSearch />}

      <div className="search-wrapper">
        <Search
          placeholder="Search Here.."
          size="large"
          value={searchValue}
          onChange={handleChange}
          onSearch={handleSearch}
          variant="borderless"
        />
      </div>
    </div>
  );
};

export default SearchQuery;
