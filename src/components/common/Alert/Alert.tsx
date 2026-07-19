import { showAlert } from "./ShowAlert";

export const SuccessAlert = (title: string, text?: string) =>
  showAlert({ title, text, variant: "success" });

export const ErrorAlert = (title: string, text?: string) =>
  showAlert({ title, text, variant: "error" });

export const WarningAlert = (title: string, text?: string) =>
  showAlert({ title, text, variant: "warning" });

export const InfoAlert = (title: string, text?: string) =>
  showAlert({ title, text, variant: "info" });

export const ConfirmAlert = async (
  title: string,
  text?: string,
): Promise<boolean> => {
  const res = await showAlert({
    title,
    text,
    variant: "confirm",
    showCancel: true,
    confirmText: "Yes",
    cancelText: "No",
  });

  return res.isConfirmed;
};
