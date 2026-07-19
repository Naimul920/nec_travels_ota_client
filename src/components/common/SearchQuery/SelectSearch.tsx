"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
import { Select } from "antd";
import dayjs from "dayjs";
// 2. Swapped React Router utilities for Next.js App Router hooks
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const { Option } = Select;

type SelectValue = "" | "today" | "tomorrow";

const SelectSearch: React.FC = () => {
  // 3. Initialized Next.js 16 search parameter, routing, and pathname hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const today = dayjs().format("DD-MM-YYYY");
  const tomorrow = dayjs().add(1, "day").format("DD-MM-YYYY");

  const travelDate = searchParams.get("travel_date");

  const selectedLabel: SelectValue =
    travelDate === today ? "today" : travelDate === tomorrow ? "tomorrow" : "";

  const handleChange = (value: SelectValue) => {
    // 4. Create a mutable instance from the current read-only search parameters
    const newParams = new URLSearchParams(searchParams.toString());

    if (value === "today") {
      newParams.set("travel_date", today);
    } else if (value === "tomorrow") {
      newParams.set("travel_date", tomorrow);
    } else {
      newParams.delete("travel_date");
    }

    // 5. Update the URL state using Next.js native router engine
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div style={{ width: 200 }}>
      <Select
        value={selectedLabel}
        onChange={handleChange}
        style={{ width: "100%" }}
        variant="borderless"
        className="border rounded-md h-[38.5px]"
        placeholder="Select"
      >
        <Option value="">All</Option>
        <Option value="today">Today</Option>
        <Option value="tomorrow">Tomorrow</Option>
      </Select>
    </div>
  );
};

export default SelectSearch;
