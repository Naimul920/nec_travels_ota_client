import React from "react";
import {
  FaHome,
  FaTachometerAlt,
  FaPlane,
  FaFolder,
  FaHeadset,
  FaAddressBook,
  FaUniversity,
  FaCog,
  FaPhoneAlt,
  FaBookmark,
  FaTimesCircle,
  FaTicketAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaFileInvoice,
  FaReceipt,
  FaBan,
  FaUndoAlt,
  FaRedoAlt,
  FaMinusCircle,
  FaPlusCircle,
  FaWhatsapp,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaYoutube,
  FaUser,
  FaImage,
} from "react-icons/fa";

export interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export enum Role {
  SUPER_ADMIN = "super-admin",
  ADMIN = "admin",
  B2B = "b2b",
  B2C = "b2c",
}

const baseNavigationItems: NavItem[] = [
  {
    path: "",
    label: "Home",
    icon: <FaHome />,
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    path: "/air-tickets",
    label: "Air Tickets",
    icon: <FaPlane />,
    children: [
      {
        path: "/air-tickets/hold",
        label: "Hold Tickets",
        icon: <FaBookmark />,
      },
      {
        path: "/air-tickets/cancel",
        label: "Cancel Tickets",
        icon: <FaTimesCircle />,
      },
      {
        path: "/air-tickets/issued",
        label: "Issued Ticked",
        icon: <FaTicketAlt />,
      },
    ],
  },
  {
    path: "/transactions",
    label: "Transactions",
    icon: <FaFolder />,
    children: [
      {
        path: "/transactions/payments",
        label: "Payments",
        icon: <FaMoneyBillWave />,
      },
      {
        path: "/transactions/credit",
        label: "Credit",
        icon: <FaCreditCard />,
      },
      {
        path: "/transactions/debit-voucher",
        label: "Debit Voucher",
        icon: <FaFileInvoice />,
      },
      {
        path: "/transactions/statement",
        label: "Statement",
        icon: <FaReceipt />,
      },
    ],
  },
  {
    path: "/support",
    label: "Support",
    icon: <FaHeadset />,
    children: [
      {
        path: "/support/void",
        label: "Void",
        icon: <FaBan />,
      },
      {
        path: "/support/refund",
        label: "Refund",
        icon: <FaUndoAlt />,
      },
      {
        path: "/support/reissue",
        label: "Re-issue",
        icon: <FaRedoAlt />,
      },
      {
        path: "/support/cancel-open",
        label: "cancel open",
        icon: <FaMinusCircle />,
      },
      {
        path: "/support/add-ssr",
        label: "Add ssr",
        icon: <FaPlusCircle />,
      },
    ],
  },
  {
    path: "/passenger-database",
    label: "Passanger Data base",
    icon: <FaAddressBook />,
  },
  {
    path: "/bank-info",
    label: "Bank Info",
    icon: <FaUniversity />,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: <FaCog />,
    children: [
      {
        path: "/settings/profile",
        label: "Profile Setting",
        icon: <FaUser />,
      },
      {
        path: "/settings/logo",
        label: "Upload Logo",
        icon: <FaImage />,
      },
    ],
  },
  {
    path: "/contact-us",
    label: "Contact US",
    icon: <FaPhoneAlt />,
    children: [
      {
        path: "/contact-us/whatsapp",
        label: "Whats-app Link",
        icon: <FaWhatsapp />,
      },
      {
        path: "/contact-us/facebook",
        label: "Facebook Link",
        icon: <FaFacebook />,
      },
      {
        path: "/contact-us/website",
        label: "Website Link",
        icon: <FaGlobe />,
      },
      {
        path: "/contact-us/instagram",
        label: "Instagram",
        icon: <FaInstagram />,
      },
      {
        path: "/contact-us/youtube",
        label: "YouTube",
        icon: <FaYoutube />,
      },
    ],
  },
];

export const navigationConfig: Record<Role, NavItem[]> = {
  [Role.SUPER_ADMIN]: baseNavigationItems,
  [Role.ADMIN]: baseNavigationItems,
  [Role.B2B]: baseNavigationItems,
  [Role.B2C]: baseNavigationItems,
};