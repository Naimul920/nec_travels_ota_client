import type { Passenger } from "@/interface";

export const createPassengers = (count: number): Passenger[] =>
  Array.from({ length: count }, () => ({
    title: "",
    firstname: "",
    lastname: "",
    gender: "",
    date_of_birth: "",
    country: "",
    passport_number: "",
    passport_expire: "",
    email: "",
    phone: "",
  }));
