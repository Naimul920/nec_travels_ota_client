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
} from "react-icons/fa";
import { ImList2 } from "react-icons/im";

export interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export const navigationConfig: Record<string, NavItem[]> = {
  admin: [
    { path: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { path: "users", label: "Users" },
    { path: "adds", label: "Adds" },
    {
      path: "transaction",
      label: "Transactions",
      children: [
        { path: "deposit", label: "Deposit" },
        { path: "withdraw", label: "Withdraw" },
        { path: "statement", label: "Statement" },
      ],
    },
    { path: "commission", label: "Referral Commission" },
    { path: "bird", label: "Bird Management" },
    { path: "notice", label: "Notice Management" },
    { path: "profile", label: "My Profile" },
  ],
  agent: [
    { path: "home", label: "Home", icon: <FaHome /> },
    { path: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      path: "air-tickets",
      label: "Air Tickets",
      icon: <FaTicketAlt />,
      children: [
        {
          path: "hold-tickets",
          label: "Hold Tickets",
          icon: <FaFileInvoiceDollar />,
        },
        { path: "cancel-tickets", label: "Cancel Tickets", icon: <FaUndo /> },
        {
          path: "issued-ticked",
          label: "Issued Ticket",
          icon: <FaRegIdBadge />,
        },
      ],
    },
    {
      path: "transactions",
      label: "Transactions",
      icon: <FaMoneyCheckAlt />,
      children: [
        { path: "payments", label: "Payments", icon: <FaMoneyCheckAlt /> },
        { path: "credit", label: "Credit", icon: <FaRegCreditCard /> },
        {
          path: "debit-voucher",
          label: "Debit Voucher",
          icon: <FaFileInvoiceDollar />,
        },
        { path: "statement", label: "Statement", icon: <FaBalanceScale /> },
      ],
    },
    {
      path: "support",
      label: "Support",
      icon: <FaHeadset />,
      children: [
        { path: "all-support", label: "All Support", icon: <ImList2 /> },
        { path: "void", label: "Void", icon: <FaUndo /> },
        { path: "refund", label: "Refund", icon: <FaUndo /> },
        { path: "re-issue", label: "Re Issue", icon: <FaTicketAlt /> },
        { path: "cancel-open", label: "Cancel Open", icon: <FaUndo /> },
        { path: "add-ssr", label: "Add SSR", icon: <FaUsers /> },
      ],
    },
    {
      path: "setting",
      label: "Setting",
      icon: <FaUserCog />,
      children: [
        { path: "profile", label: "Profile", icon: <FaUserCog /> },
        { path: "passengers", label: "Passengers List", icon: <FaUsers /> },
      ],
    },
    { path: "bank-info", label: "Bank Info", icon: <FaUniversity /> },
  ],
  b2c: [
    { path: "dashboard", label: "Dashboard" },
    { path: "task", label: "Task" },
    { path: "referral", label: "Referral" },
    {
      path: "transaction",
      label: "Transactions",
      children: [
        { path: "deposit", label: "Deposit" },
        { path: "withdraw", label: "Withdraw" },
        { path: "statement", label: "Statement" },
      ],
    },
    { path: "profile", label: "My Profile" },
  ],
  superadmin: [
    { path: "home", label: "Home", icon: <FaHome /> },
    { path: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      path: "air-tickets",
      label: "Air Tickets",
      icon: <FaTicketAlt />,
      children: [
        {
          path: "hold-tickets",
          label: "Hold Tickets",
          icon: <FaFileInvoiceDollar />,
        },
        { path: "cancel-tickets", label: "Cancel Tickets", icon: <FaUndo /> },
        {
          path: "issued-ticked",
          label: "Issued Ticket",
          icon: <FaRegIdBadge />,
        },
      ],
    },
    {
      path: "transactions",
      label: "Transactions",
      icon: <FaMoneyCheckAlt />,
      children: [
        { path: "payments", label: "Payments", icon: <FaMoneyCheckAlt /> },
        { path: "credit", label: "Credit", icon: <FaRegCreditCard /> },
        {
          path: "debit-voucher",
          label: "Debit Voucher",
          icon: <FaFileInvoiceDollar />,
        },
        { path: "statement", label: "Statement", icon: <FaBalanceScale /> },
      ],
    },
    {
      path: "support",
      label: "Support",
      icon: <FaHeadset />,
      children: [
        { path: "void", label: "Void", icon: <FaUndo /> },
        { path: "refund", label: "Refund", icon: <FaUndo /> },
        { path: "re-issue", label: "Re Issue", icon: <FaTicketAlt /> },
        { path: "cancel-open", label: "Cancel Open", icon: <FaUndo /> },
        { path: "add-ssr", label: "Add SSR", icon: <FaUsers /> },
      ],
    },
    {
      path: "setting",
      label: "Setting",
      icon: <FaUserCog />,
      children: [
        { path: "profile", label: "Profile", icon: <FaUserCog /> },
        { path: "passengers", label: "Passengers List", icon: <FaUsers /> },
      ],
    },
    { path: "bank-info", label: "Bank Info", icon: <FaUniversity /> },
  ],
};
