import type { AlertConfig } from "@/interface";
import { alertTheme } from "./AlertTheme";
import { baseSwal } from "./BaseSwal";

export const showAlert = async ({
  title,
  text,
  variant = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}: AlertConfig) => {
  const theme = alertTheme[variant];

  return baseSwal.fire({
    title,
    text,
    icon: undefined,
    iconHtml: theme.iconHtml,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    showCancelButton: showCancel,
    background: "#fff",
    customClass: {
      popup: `${theme.bg} rounded-xl`,
      confirmButton: theme.confirmBtn,
      cancelButton: theme.cancelBtn,
    },
  });
};
