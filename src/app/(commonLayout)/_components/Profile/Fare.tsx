"use client"; // 1. Next.js 16 Client Component Boundary

import React from "react";
import { IoChevronDown } from "react-icons/io5";
import { Button, Select } from "@/components/ui";

const Fare: React.FC = () => {
  return (
    <>
      <div className="max-w-full md:space-y-5 space-y-2">
        <h1 className="text-primary md:text-2xl text-lg font-bold">
          Chose Show/Hide Agent Fare :
        </h1>
        <Select
          label="SELECT AGENT FARE SHOW TYPE :"
          className="bg-white border-primary rounded"
          //   value={role}
          //   onChange={(e) => setRole(e.target.value)}
          options={[
            { label: "Agent Fare Show", value: "show" },
            { label: "Agent Fare Hide", value: "hide" },
          ]}
          iconRight={<IoChevronDown />}
        />
        <Button className="bg-primary text-white w-30 h-10">Update</Button>
      </div>
    </>
  );
};

export default Fare;
