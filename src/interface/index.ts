import { type ReactNode } from "react";
import type { AlertVariant, BankType } from "@/types/types";

export interface AppRoute {
  path?: string;
  element?: ReactNode;
  icon?: ReactNode;
  label?: string;
  children?: AppRoute[];
}

export interface AlertConfig {
  title: string;
  text?: string;
  variant?: AlertVariant;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  timer?: number;
  showConfirmButton?: boolean;
}

export interface BankAccountInfo {
  id: string;
  type: BankType;
  name: string;
  bankName: string;
  branch?: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  accountType: string;
  logo: string;
}

export interface Passenger {
  title: string;
  name: string;
  email: string;
  phone: string;
  image: string;
}

export interface BookingFormValues {
  tripType: string | null;
  cabin: string | null;
  adult: Passenger[];
  child: Passenger[];
  kid: Passenger[];
  infant: Passenger[];
}
