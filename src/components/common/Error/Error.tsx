import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface Props {
  title?: string;
  message?: string;
}

const Error: React.FC<Props> = ({
  title = "Invalid Request",
  message = "The link you used is invalid or expired. Please try again.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] rounded-xl p-6 text-center my-5 bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
      <FiAlertTriangle className="text-red-500 text-4xl mb-3" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600 mt-1">{message}</p>
    </div>
  );
};

export default Error;
