import React from "react";
import { FiHome } from "react-icons/fi";
import {
  FaHome,
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
  FaQuestionCircle,
  FaPlane,
  FaTasks,
  FaGift,
} from "react-icons/fa";
import { ImList2 } from "react-icons/im";

export interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export const navigationConfig: Record<string, NavItem[]> = {
  // ==========================================
  // SUPER ADMIN (Full Platform Management)
  // ==========================================
  superadmin: [
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      path: "/agency-management",
      label: "B2B Agencies",
      icon: <FaUserTie />,
      children: [
        { path: "/all-agencies", label: "All Agencies", icon: <FaUsers /> },
        { path: "/agency-approval", label: "Pending Approvals", icon: <FaShieldAlt /> },
        { path: "/credit-limits", label: "Agency Credit Limits", icon: <FaRegCreditCard /> },
      ],
    },
    {
      path: "/air-tickets",
      label: "Air Tickets",
      icon: <FaTicketAlt />,
      children: [
        { path: "/hold-tickets", label: "Hold Tickets", icon: <FaFileInvoiceDollar /> },
        { path: "/issued-tickets", label: "Issued Tickets", icon: <FaRegIdBadge /> },
        { path: "/cancel-tickets", label: "Cancel Requests", icon: <FaUndo /> },
      ],
    },
    {
      path: "/transactions",
      label: "Financials",
      icon: <FaMoneyCheckAlt />,
      children: [
        { path: "/payments", label: "Payments", icon: <FaMoneyCheckAlt /> },
        { path: "/credit", label: "Credit Management", icon: <FaRegCreditCard /> },
        { path: "/debit-voucher", label: "Debit Vouchers", icon: <FaFileInvoiceDollar /> },
        { path: "/statement", label: "Master Ledger", icon: <FaBalanceScale /> },
      ],
    },
    {
      path: "/supplier-api",
      label: "API & GDS Management",
      icon: <FaCogs />,
      children: [
        { path: "/gds-config", label: "GDS Settings", icon: <FaCogs /> },
        { path: "/markups", label: "Global Markups", icon: <FaCoins /> },
      ],
    },
    {
      path: "/support",
      label: "Support Desk",
      icon: <FaHeadset />,
      children: [
        { path: "/all-support", label: "All Tickets", icon: <ImList2 /> },
        { path: "/void", label: "Void Requests", icon: <FaUndo /> },
        { path: "/refund", label: "Refund Requests", icon: <FaUndo /> },
        { path: "/re-issue", label: "Re-issue Requests", icon: <FaTicketAlt /> },
      ],
    },
    { path: "/bank-info", label: "Bank Info", icon: <FaUniversity /> },
    {
      path: "/setting",
      label: "System Settings",
      icon: <FaUserCog />,
      children: [
        { path: "/profile", label: "Profile", icon: <FaUserCog /> },
        { path: "/notices", label: "Global Notices", icon: <FaBullhorn /> },
      ],
    },
  ],

  // ==========================================
  // ADMIN (Operations & User Control)
  // ==========================================
  admin: [
    { path: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "/users", label: "Manage Users", icon: <FaUsers /> },
    { path: "/promotional-ads", label: "Promotions & Ads", icon: <FaBullhorn /> },
    {
      path: "/transaction",
      label: "Transactions",
      icon: <FaMoneyCheckAlt />,
      children: [
        { path: "/deposit", label: "Deposit Requests", icon: <FaMoneyCheckAlt /> },
        { path: "/withdraw", label: "Withdraw Requests", icon: <FaUndo /> },
        { path: "/statement", label: "Statement", icon: <FaBalanceScale /> },
      ],
    },
    { path: "/commission", label: "Referral Commission", icon: <FaCoins /> },
    { path: "/notice", label: "Notice Board", icon: <FaListAlt /> },
    { path: "/bank-info", label: "Bank Details", icon: <FaUniversity /> },
    { path: "/profile", label: "My Profile", icon: <FaUserCog /> },
  ],

  // ==========================================
  // B2B (Travel Agencies / Partners)
  // ==========================================
  b2b: [
    { path: "/home", label: "Home", icon: <FaHome /> },
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      path: "/air-tickets",
      label: "Air Tickets",
      icon: <FaTicketAlt />,
      children: [
        { path: "/hold-tickets", label: "Hold Tickets", icon: <FaFileInvoiceDollar /> },
        { path: "/cancel-tickets", label: "Cancel Tickets", icon: <FaUndo /> },
        { path: "/issued-ticked", label: "Issued Tickets", icon: <FaRegIdBadge /> },
      ],
    },
    {
      path: "/transactions",
      label: "Transactions",
      icon: <FaMoneyCheckAlt />,
      children: [
        { path: "/payments", label: "Payments", icon: <FaMoneyCheckAlt /> },
        { path: "/credit", label: "Credit Log", icon: <FaRegCreditCard /> },
        { path: "/debit-voucher", label: "Debit Voucher", icon: <FaFileInvoiceDollar /> },
        { path: "/statement", label: "Statement", icon: <FaBalanceScale /> },
      ],
    },
    {
      path: "/support",
      label: "Support",
      icon: <FaHeadset />,
      children: [
        { path: "/all-support", label: "All Support", icon: <ImList2 /> },
        { path: "/void", label: "Void", icon: <FaUndo /> },
        { path: "/refund", label: "Refund", icon: <FaUndo /> },
        { path: "/re-issue", label: "Re-Issue", icon: <FaTicketAlt /> },
        { path: "/cancel-open", label: "Cancel Open", icon: <FaUndo /> },
        { path: "/add-ssr", label: "Add SSR", icon: <FaUsers /> },
      ],
    },
    {
      path: "/setting",
      label: "Settings",
      icon: <FaUserCog />,
      children: [
        { path: "/profile", label: "Agency Profile", icon: <FaUserCog /> },
        { path: "/passengers", label: "Saved Passengers", icon: <FaUsers /> },
      ],
    },
    { path: "/bank-info", label: "Bank Accounts", icon: <FaUniversity /> },
  ],

  // ==========================================
  // B2C (End Customers / Travelers)
  // ==========================================
  b2c: [
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/my-bookings", label: "My Flights", icon: <FaPlane /> },
    { path: "/task", label: "Tasks & Rewards", icon: <FaTasks /> },
    { path: "/referral", label: "Referral Program", icon: <FaGift /> },
    {
      path: "/transaction",
      label: "My Transactions",
      icon: <FaMoneyCheckAlt />,
      children: [
        { path: "/deposit", label: "Deposit", icon: <FaMoneyCheckAlt /> },
        { path: "/withdraw", label: "Withdraw", icon: <FaUndo /> },
        { path: "/statement", label: "Statement", icon: <FaBalanceScale /> },
      ],
    },
    { path: "/help-desk", label: "Help Center", icon: <FaQuestionCircle /> },
    { path: "/profile", label: "My Profile", icon: <FaUserCog /> },
  ],
};