import React from "react";
import {
  FaTachometerAlt,
  FaTicketAlt,
  FaMoneyCheckAlt,
  FaUserCog,
  FaHeadset,
  FaBalanceScale,
  FaUsers,
  FaRegCreditCard,
  FaFileInvoiceDollar,
  FaUndo,
  FaRegIdBadge,
  FaUniversity,
  FaBullhorn,
  FaCogs,
  FaListAlt,
  FaShieldAlt,
  FaUserTie,
  FaCoins,
  FaPlane,
  FaGift,
  FaHome,
  FaMinusCircle,
  FaPlusCircle,
  FaPhoneAlt,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { ImList2 } from "react-icons/im";

export interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  /** Required departments for this item (ADMIN role). Empty/undefined = shown to all. */
  departments?: string[];
}

export enum NavRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  B2B = "b2b",
  // B2C = "b2c",
}

export const navigationConfig: Record<NavRole, NavItem[]> = {
  // =====================================================
  // SUPER ADMIN
  // =====================================================

  [NavRole.SUPER_ADMIN]: [
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
      path: "/agencies",
      label: "Agencies",
      icon: <FaUserTie />,
      children: [
        {
          path: "/all",
          label: "All Agencies",
          icon: <FaUsers />,
        },
        {
          path: "/approvals",
          label: "Approvals",
          icon: <FaShieldAlt />,
        },
        {
          path: "/credit-limits",
          label: "Credit Limits",
          icon: <FaRegCreditCard />,
        },
      ],
    },

    {
      path: "/bookings",
      label: "Bookings",
      icon: <FaTicketAlt />,
      children: [
        {
          path: "/hold",
          label: "Hold Bookings",
          icon: <FaFileInvoiceDollar />,
        },
        {
          path: "/issued",
          label: "Issued Tickets",
          icon: <FaRegIdBadge />,
        },
        {
          path: "/cancel-requests",
          label: "Cancel Requests",
          icon: <FaUndo />,
        },
      ],
    },

    {
      path: "/finance",
      label: "Finance",
      icon: <FaMoneyCheckAlt />,
      children: [
        {
          path: "/payments",
          label: "Payments",
          icon: <FaMoneyCheckAlt />,
        },
        {
          path: "/credits",
          label: "Credit Management",
          icon: <FaRegCreditCard />,
        },
        {
          path: "/debit-vouchers",
          label: "Debit Vouchers",
          icon: <FaFileInvoiceDollar />,
        },
        {
          path: "/ledger",
          label: "Master Ledger",
          icon: <FaBalanceScale />,
        },
      ],
    },

    {
      path: "/integrations",
      label: "Integrations",
      icon: <FaCogs />,
      children: [
        {
          path: "/gds",
          label: "GDS Configuration",
          icon: <FaCogs />,
        },
        {
          path: "/markups",
          label: "Markups",
          icon: <FaCoins />,
        },
      ],
    },

    {
      path: "/support",
      label: "Support",
      icon: <FaHeadset />,
      children: [
        {
          path: "/tickets",
          label: "Tickets",
          icon: <ImList2 />,
        },
        {
          path: "/void",
          label: "Void Requests",
          icon: <FaUndo />,
        },
        {
          path: "/refund",
          label: "Refund Requests",
          icon: <FaUndo />,
        },
        {
          path: "/reissue",
          label: "Reissue Requests",
          icon: <FaTicketAlt />,
        },
      ],
    },

    {
      path: "/banks",
      label: "Banks",
      icon: <FaUniversity />,
    },

    {
      path: "/settings",
      label: "Settings",
      icon: <FaUserCog />,
      children: [
        {
          path: "/profile",
          label: "Profile",
          icon: <FaUserCog />,
        },
        {
          path: "/notices",
          label: "Notices",
          icon: <FaBullhorn />,
        },
      ],
    },
  ],

  // =====================================================
  // ADMIN
  // =====================================================

  [NavRole.ADMIN]: [
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
      icon: <FaTicketAlt />,
      departments: ["OPERATION", "RESERVATION", "IT"],
      children: [
        {
          path: "/hold",
          label: "Hold Tickets",
          icon: <FaFileInvoiceDollar />,
        },
        {
          path: "/issued",
          label: "Issued Tickets",
          icon: <FaRegIdBadge />,
        },
        {
          path: "/cancelled",
          label: "Cancelled Tickets",
          icon: <FaUndo />,
        },
        {
          path: "/flown",
          label: "Flown Tickets",
          icon: <FaPlane />,
        },
      ],
    },

    {
      path: "/flight-search",
      label: "Flight Search",
      icon: <FaPlane />,
      departments: ["OPERATION", "RESERVATION"],
    },

    {
      path: "/users",
      label: "Users",
      icon: <FaUsers />,
      departments: ["IT", "SALES"],
    },

    {
      path: "/transactions",
      label: "Transactions",
      icon: <FaMoneyCheckAlt />,
      departments: ["ACCOUNTS", "IT"],
      children: [
        {
          path: "/deposits",
          label: "Deposits",
          icon: <FaMoneyCheckAlt />,
        },
        {
          path: "/withdrawals",
          label: "Withdrawals",
          icon: <FaUndo />,
        },
        {
          path: "/statements",
          label: "Statements",
          icon: <FaBalanceScale />,
        },
      ],
    },

    {
      path: "/promotions",
      label: "Promotions",
      icon: <FaBullhorn />,
      departments: ["MARKETING", "SALES"],
    },

    {
      path: "/commissions",
      label: "Commissions",
      icon: <FaCoins />,
      departments: ["ACCOUNTS", "SALES"],
    },

    {
      path: "/notices",
      label: "Notices",
      icon: <FaListAlt />,
      departments: ["MARKETING", "IT"],
    },

    {
      path: "/banks",
      label: "Banks",
      icon: <FaUniversity />,
      departments: ["ACCOUNTS", "IT"],
    },

    {
      path: "/profile",
      label: "Profile",
      icon: <FaUserCog />,
    },
  ],

  // =====================================================
  // B2B
  // =====================================================

  [NavRole.B2B]: [
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
      path: "/bookings",
      label: "Air Tickets",
      icon: <FaTicketAlt />,
      children: [
        {
          path: "/hold",
          label: "Hold Tickets",
          icon: <FaFileInvoiceDollar />,
        },
        {
          path: "/issued",
          label: "Issued Tickets",
          icon: <FaRegIdBadge />,
        },
        {
          path: "/cancel",
          label: "Cancelled Tickets",
          icon: <FaUndo />,
        },
        {
          path: "/flown",
          label: "Flown Tickets",
          icon: <FaPlane />,
        },
      ],
    },

    {
      path: "/support",
      label: "Supports",
      icon: <FaHeadset />,
      children: [
        {
          path: "/void",
          label: "Void",
          icon: <FaUndo />,
        },
        {
          path: "/refund",
          label: "Refund",
          icon: <FaUndo />,
        },
        {
          path: "/reissue",
          label: "Re-issue / Date Change",
          icon: <FaTicketAlt />,
        },
        {
          path: "/cancel-open",
          label: "Cancel Open",
          icon: <FaMinusCircle />,
        },
        {
          path: "/add-ssr",
          label: "Add SSR Service",
          icon: <FaPlusCircle />,
          children: [
            {
              path: "/seat-selection",
              label: "Seat Selection",
              icon: <FaCogs />,
            },
            {
              path: "/meals",
              label: "Meals",
              icon: <FaGift />,
            },
            {
              path: "/wheelchair",
              label: "Wheelchair",
              icon: <FaCogs />,
            },
            {
              path: "/vvip-notes",
              label: "VVIP Notes",
              icon: <FaCogs />,
            },
            {
              path: "/fare-difference",
              label: "Fare Differency",
              icon: <FaCoins />,
            },
            {
              path: "/extra-baggage",
              label: "Extra Baggage",
              icon: <FaCogs />,
            },
            {
              path: "/additional-charges",
              label: "Additional Charges",
              icon: <FaCoins />,
            },
          ],
        },
        {
          path: "/ticket-copy",
          label: "Airlines Ticket Copy",
          icon: <FaFileInvoiceDollar />,
        },
        {
          path: "/frequent-flyer",
          label: "Frequent Flyer Number",
          icon: <FaRegIdBadge />,
        },
      ],
    },

    {
      path: "/finance",
      label: "Transactions",
      icon: <FaMoneyCheckAlt />,
      children: [
        {
          path: "/payments",
          label: "Payments",
          icon: <FaMoneyCheckAlt />,
        },
        {
          path: "/ssr-payments",
          label: "SSR Payments",
          icon: <FaCoins />,
        },
        {
          path: "/adm",
          label: "ADM",
          icon: <FaFileInvoiceDollar />,
        },
        {
          path: "/statements",
          label: "Statement",
          icon: <FaBalanceScale />,
        },
      ],
    },

    {
      path: "/passengers",
      label: "My Passenger",
      icon: <FaUsers />,
    },

    {
      path: "/profile",
      label: "My Profile",
      icon: <FaUserCog />,
    },

    {
      path: "/banks",
      label: "Bank Details",
      icon: <FaUniversity />,
    },

    {
      path: "/contact",
      label: "Contact US",
      icon: <FaPhoneAlt />,
      children: [
        {
          path: "/whatsapp",
          label: "Whats-app Link",
          icon: <FaWhatsapp />,
        },
        {
          path: "/facebook",
          label: "Facebook Link",
          icon: <FaFacebook />,
        },
        {
          path: "/website",
          label: "Website Link",
          icon: <FaGlobe />,
        },
        {
          path: "/instagram",
          label: "Instagram",
          icon: <FaInstagram />,
        },
        {
          path: "/youtube",
          label: "YouTube",
          icon: <FaYoutube />,
        },
      ],
    },
  ],

  // =====================================================
  // B2C
  // =====================================================

  // [NavRole.B2C]: [
  //   {
  //     path: "",
  //     label: "Home",
  //     icon: <FaHome />,
  //   },
  //   {
  //     path: "/dashboard",
  //     label: "Dashboard",
  //     icon: <FaTachometerAlt />,
  //   },

  //   {
  //     path: "/bookings",
  //     label: "My Bookings",
  //     icon: <FaPlane />,
  //   },

  //   {
  //     path: "/tasks",
  //     label: "Tasks",
  //     icon: <FaTasks />,
  //   },

  //   {
  //     path: "/referrals",
  //     label: "Referrals",
  //     icon: <FaGift />,
  //   },

  //   {
  //     path: "/transactions",
  //     label: "Transactions",
  //     icon: <FaMoneyCheckAlt />,
  //     children: [
  //       {
  //         path: "/deposits",
  //         label: "Deposits",
  //         icon: <FaMoneyCheckAlt />,
  //       },
  //       {
  //         path: "/withdrawals",
  //         label: "Withdrawals",
  //         icon: <FaUndo />,
  //       },
  //       {
  //         path: "/statements",
  //         label: "Statements",
  //         icon: <FaBalanceScale />,
  //       },
  //     ],
  //   },

  //   {
  //     path: "/support",
  //     label: "Support",
  //     icon: <FaQuestionCircle />,
  //   },

  //   {
  //     path: "/profile",
  //     label: "Profile",
  //     icon: <FaUserCog />,
  //   },
  // ],
};
