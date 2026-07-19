"use client";

import React from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { renderToString } from "react-dom/server";
import type { SweetAlertIcon } from "sweetalert2";

export const alertTheme: Record<
  string,
  {
    icon?: SweetAlertIcon;
    iconHtml: string;
    bg: string;
    confirmBtn: string;
    cancelBtn?: string;
  }
> = {
  success: {
    iconHtml: `
      <div class="flex justify-center mb-4">
        ${renderToString(<FaCheckCircle className="text-6xl text-primary" />)}
      </div>
    `,
    bg: "bg-primary",
    confirmBtn:
      "bg-primary text-white hover:bg-green-700 py-2 px-6 rounded-md transition-colors duration-200",
  },

  error: {
    iconHtml: `
      <div class="flex justify-center mb-4">
        ${renderToString(
          <RiErrorWarningFill className="text-6xl text-secondary" />,
        )}
      </div>
    `,
    bg: "bg-secondary",
    confirmBtn:
      "bg-secondary/90 text-white hover:cursor-pointer py-2 px-6 rounded-md transition-colors duration-200",
  },

  warning: {
    iconHtml: `
      <div class="flex justify-center mb-4">
        ${renderToString(
          <FaExclamationTriangle className="text-6xl text-yellow-500" />,
        )}
      </div>
    `,
    bg: "bg-yellow-50",
    confirmBtn:
      "bg-yellow-500 text-white hover:bg-yellow-600 py-2 px-6 rounded-md transition-colors duration-200",
  },

  info: {
    iconHtml: `
      <div class="flex justify-center mb-4">
        ${renderToString(<FaInfoCircle className="text-6xl text-blue-600" />)}
      </div>
    `,
    bg: "bg-blue-50",
    confirmBtn:
      "bg-blue-600 text-white hover:bg-blue-700 py-2 px-6 rounded-md transition-colors duration-200",
  },

  confirm: {
    iconHtml: `
      <div class="flex justify-center mb-4">
        ${renderToString(
          <FaQuestionCircle className="text-6xl text-indigo-600" />,
        )}
      </div>
    `,
    bg: "bg-gray-50",
    confirmBtn:
      "bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-6 rounded-md transition-colors duration-200",
    cancelBtn:
      "bg-gray-300 text-black hover:bg-gray-400 py-2 px-6 rounded-md transition-colors duration-200",
  },
};
