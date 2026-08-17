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
  FaBoxOpen,
  FaMoneyBillWave,
  FaBell,
  FaNewspaper,
  FaArrowDown,
  FaClock,
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
  /** View-only departments (read access only, ADMIN role). */
  readOnlyDepartments?: string[];
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
    // {
    //   path: "",
    //   label: "Home",
    //   icon: <FaHome />,
    // },
    {
      path: "/",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },

    // {
    //   path: "/agencies",
    //   label: "Agencies",
    //   icon: <FaUserTie />,
    //   children: [
    //     {
    //       path: "/all",
    //       label: "All Agencies",
    //       icon: <FaUsers />,
    //     },
    //     {
    //       path: "/approvals",
    //       label: "Approvals",
    //       icon: <FaShieldAlt />,
    //     },
    //     {
    //       path: "/credit-limits",
    //       label: "Credit Limits",
    //       icon: <FaRegCreditCard />,
    //     },
    //   ],
    // },

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
          path: "/voided",
          label: "Voided Tickets",
          icon: <FaRegIdBadge />,
        },
        {
          path: "/issued",
          label: "Issued Tickets",
          icon: <FaRegIdBadge />,
        },
        {
          path: "/issue_request",
          label: "Issue Request",
          icon: <FaTicketAlt />,
        },
        {
          path: "/refunded-tickets",
          label: "Refunded Tickets",
          icon: <FaUndo />,
        },
        // {
        //   path: "/cancel-requests",
        //   label: "Cancel Requests",
        //   icon: <FaUndo />,
        // },
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
      path: "/transaction",
      label: "Transaction",
      icon: <FaMoneyCheckAlt />,
      children: [
        // {
        //   path: "/payments",
        //   label: "Payments",
        //   icon: <FaMoneyCheckAlt />,
        // },
        {
          path: "/payments",
          label: "Deposit request",
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

    // {
    //   path: "/integrations",
    //   label: "Integrations",
    //   icon: <FaCogs />,
    //   children: [
    //     {
    //       path: "/gds",
    //       label: "GDS Configuration",
    //       icon: <FaCogs />,
    //     },
    //     {
    //       path: "/markups",
    //       label: "Markups",
    //       icon: <FaCoins />,
    //     },
    //   ],
    // },

    {
      path: "/banks",
      label: "Banks",
      icon: <FaUniversity />,
    },

    // {
    //   path: "/deposits",
    //   label: "Deposits",
    //   icon: <FaArrowDown />,
    //   children: [
    //     {
    //       path: "/all",
    //       label: "All Deposits",
    //       icon: <FaArrowDown />,
    //     },
    //     {
    //       path: "/pending",
    //       label: "Pending Deposits",
    //       icon: <FaClock />,
    //     },
    //   ],
    // },

    // {
    //   path: "/notices",
    //   label: "Notices",
    //   icon: <FaBullhorn />,
    //   children: [
    //     {
    //       path: "/all",
    //       label: "All Notices",
    //       icon: <FaBullhorn />,
    //     },
    //     {
    //       path: "/create",
    //       label: "Create Notice",
    //       icon: <FaPlusCircle />,
    //     },
    //   ],
    // },

    // {
    //   path: "/notifications",
    //   label: "Notifications",
    //   icon: <FaBell />,
    //   children: [
    //     {
    //       path: "/all",
    //       label: "All Notifications",
    //       icon: <FaBell />,
    //     },
    //     {
    //       path: "/send",
    //       label: "Send Notification",
    //       icon: <FaPlusCircle />,
    //     },
    //   ],
    // },

    // {
    //   path: "/newsletter",
    //   label: "Newsletter",
    //   icon: <FaNewspaper />,
    //   children: [
    //     {
    //       path: "/subscribers",
    //       label: "Subscribers",
    //       icon: <FaUsers />,
    //     },
    //     {
    //       path: "/campaigns",
    //       label: "Campaigns",
    //       icon: <FaNewspaper />,
    //     },
    //   ],
    // },

    {
      path: "/commissions",
      label: "Commission",
      icon: <FaCoins />,
      children: [
        {
          path: "/all-commission",
          label: "All commission",
          icon: <FaCoins />,
        },
        // {
        //   path: "/rules",
        //   label: "Commission Rules",
        //   icon: <FaCoins />,
        // },
        // {
        //   path: "/history",
        //   label: "Commission History",
        //   icon: <FaFileInvoiceDollar />,
        // },
      ],
    },
    {
      path: "/packages",
      label: "Packages",
      icon: <FaBoxOpen />,
      children: [
        {
          path: "/all",
          label: "All Packages",
          icon: <FaBoxOpen />,
        }
        // {
        //   path: "/create",
        //   label: "Create Package",
        //   icon: <FaPlusCircle />,
        // },
      ],
    },
    {
      path: "/users",
      label: "Users",
      icon: <FaUsers />,
      children: [
        {
          path: "/all",
          label: "All User",
          icon: <FaUsers />,
        },
        {
          path: "/admin",
          label: "Admin",
          icon: <FaUsers />,
        },
        {
          path: "/agency",
          label: "Agency",
          icon: <FaUserCog />,
        },
        {
          path: "/customer",
          label: "Customer",
          icon: <FaUserCog />,
        },
        {
          path: "/approvals",
          label: "Pending Approval",
          icon: <FaUserCog />,
        },
      ],
    },

    // {
    //   path: "/currencies",
    //   label: "Currency",
    //   icon: <FaMoneyBillWave />,
    //   children: [
    //     {
    //       path: "/list",
    //       label: "Currency List",
    //       icon: <FaMoneyBillWave />,
    //     },
    //     {
    //       path: "/rates",
    //       label: "Exchange Rates",
    //       icon: <FaBalanceScale />,
    //     },
    //   ],
    // },

    // {
    //   path: "/settings",
    //   label: "Settings",
    //   icon: <FaUserCog />,
    //   children: [
    //     // {
    //     //   path: "/profile",
    //     //   label: "Profile",
    //     //   icon: <FaUserCog />,
    //     // },
    //     // {
    //     //   path: "/notices",
    //     //   label: "Notices",
    //     //   icon: <FaBullhorn />,
    //     // },
    //     {
    //       path: "/package",
    //       label: "Package",
    //       icon: <FaBullhorn />,
    //     },
    //     {
    //       path: "/commission",
    //       label: "Commission",
    //       icon: <FaBullhorn />,
    //     },
    //   ],
    // },
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
      departments: ["OPERATION", "RESERVATION", "MARKETING", "ACCOUNTS"],
      children: [
        {
          path: "/hold",
          label: "Hold Queue",
          icon: <FaFileInvoiceDollar />,
        },
        {
          path: "/pending",
          label: "Pending Order / Ordered Queue",
          icon: <FaListAlt />,
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/issued",
          label: "Issued Tickets list",
          icon: <FaRegIdBadge />,
        },
        {
          path: "/cancelled",
          label: "Cancelled Tickets list",
          icon: <FaUndo />,
        },
        {
          path: "/flown",
          label: "Flown Tickets list",
          icon: <FaPlane />,
          departments: ["OPERATION", "RESERVATION", "ACCOUNTS"],
        },
      ],
    },

    {
      path: "/support",
      label: "Supports",
      icon: <FaHeadset />,
      departments: ["OPERATION", "RESERVATION", "MARKETING"],
      children: [
        {
          path: "/void",
          label: "Void Request",
          icon: <FaUndo />,
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/refund",
          label: "Refund Request",
          icon: <FaUndo />,
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/reissue",
          label: "Re-issue / Date Change Request",
          icon: <FaTicketAlt />,
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/cancel-open",
          label: "Cancel Open Request",
          icon: <FaMinusCircle />,
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/add-ssr",
          label: "Add SSR Service Request",
          icon: <FaPlusCircle />,
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/ticket-copy",
          label: "Airlines Ticket Copy Request",
          icon: <FaFileInvoiceDollar />,
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/frequent-flyer",
          label: "Frequent Flyer Number Request",
          icon: <FaRegIdBadge />,
          readOnlyDepartments: ["MARKETING"],
        },
      ],
    },

    {
      path: "/transactions",
      label: "Transactions",
      icon: <FaMoneyCheckAlt />,
      departments: ["OPERATION", "RESERVATION", "MARKETING", "ACCOUNTS"],
      children: [
        {
          path: "/payments",
          label: "Payments Request",
          icon: <FaMoneyCheckAlt />,
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/ssr-payments",
          label: "SSR Payments",
          icon: <FaCoins />,
          departments: ["OPERATION", "RESERVATION", "MARKETING"],
          readOnlyDepartments: ["MARKETING"],
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
              label: "Fare Difference",
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
          path: "/adm",
          label: "ADM",
          icon: <FaFileInvoiceDollar />,
          departments: ["OPERATION", "RESERVATION", "MARKETING"],
          readOnlyDepartments: ["MARKETING"],
        },
        {
          path: "/sales-statement",
          label: "Sales Statement",
          icon: <FaBalanceScale />,
          departments: ["OPERATION", "ACCOUNTS"],
        },
        {
          path: "/agent-statement",
          label: "Agent Statement",
          icon: <FaRegCreditCard />,
          departments: ["OPERATION", "ACCOUNTS"],
        },
      ],
    },

    {
      path: "/agencies",
      label: "Agency List",
      icon: <FaUserTie />,
      departments: ["OPERATION", "MARKETING"],
    },

    {
      path: "/admins",
      label: "My Admins",
      icon: <FaUsers />,
      departments: ["OPERATION"],
    },

    {
      path: "/settings",
      label: "Settings",
      icon: <FaUserCog />,
      departments: ["OPERATION"],
      children: [
        {
          path: "/edit-agency",
          label: "Edit Agency",
          icon: <FaUserTie />,
        },
        {
          path: "/edit-currency",
          label: "Edit Currency",
          icon: <FaCoins />,
        },
        {
          path: "/edit-bank-info",
          label: "Edit Bank Info",
          icon: <FaUniversity />,
        },
        {
          path: "/notice-edit",
          label: "Notice Edit",
          icon: <FaBullhorn />,
        },
        {
          path: "/popup-notice",
          label: "Pop-up Notice",
          icon: <FaBullhorn />,
        },
      ],
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
