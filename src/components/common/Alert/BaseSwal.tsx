import Swal from "sweetalert2";

export const baseSwal = Swal.mixin({
  customClass: {
    popup: "rounded-xl shadow-lg",
    icon: "flex justify-center",
    confirmButton: "px-6 py-2 rounded-md font-medium",
    cancelButton: "px-6 py-2 rounded-md font-medium ml-2",
    title: "text-lg font-semibold",
  },
  buttonsStyling: false,
});
