import type { Passenger } from "@/interface";

export const createPassengers = (count: number): Passenger[] =>
  Array.from({ length: count }, () => ({
    title: "",
    name: "",
    email: "",
    phone: "",
    image: "",
  }));
