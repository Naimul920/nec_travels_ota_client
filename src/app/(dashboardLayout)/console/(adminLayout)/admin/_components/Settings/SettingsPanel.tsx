"use client";

import React from "react";

interface SettingsPanelProps {
  title: string;
  description: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
  description,
}) => {
  return (
    <div className="md:px-0 px-5 mt-2">
      <h1 className="text-2xl line-clamp-1 font-semibold text-gray-800">
        {title}
      </h1>
      <p className="mt-3 text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default SettingsPanel;