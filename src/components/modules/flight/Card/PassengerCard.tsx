"use client";
import React from "react";
import type { ReactNode } from "react";
import { useFormikContext } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import { Input, Select } from "@/components/ui";
import { FaUser, FaUserFriends, FaChild, FaBaby, FaGlobe } from "react-icons/fa";
import {
  MdOutlineMailOutline,
  MdOutlinePhone,
  MdOutlineBadge,
  MdOutlineCalendarMonth,
} from "react-icons/md";

interface Props {
  type: PassengerType;
  index: number;
}

const TYPE_META: Record<
  PassengerType,
  { label: string; sub: string; icon: ReactNode; tone: string }
> = {
  adult: {
    label: "Adult",
    sub: "12 years & above",
    icon: <FaUser />,
    tone: "bg-primary/10 text-primary",
  },
  child: {
    label: "Child",
    sub: "5 to under 12",
    icon: <FaUserFriends />,
    tone: "bg-secondary/10 text-secondary",
  },
  kid: {
    label: "Kid",
    sub: "2 to under 5",
    icon: <FaChild />,
    tone: "bg-amber-50 text-amber-500",
  },
  infant: {
    label: "Infant",
    sub: "Under 2",
    icon: <FaBaby />,
    tone: "bg-gray-100 text-gray-500",
  },
};

const TITLE_OPTIONS = ["Mr", "Mrs", "Ms"].map((t) => ({ label: t, value: t }));
const GENDER_OPTIONS = ["Male", "Female"].map((g) => ({ label: g, value: g }));

const PassengerCard: React.FC<Props> = ({ type, index }) => {
  const { values, handleChange, setFieldValue } =
    useFormikContext<BookingFormValues>();

  const meta = TYPE_META[type];
  const baseName = `${type}.${index}`;
  const isLead = type === "adult" && index === 0;
  const passenger = values[type][index];

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gender = e.target.value === "Mr" ? "Male" : "Female";
    setFieldValue(`${baseName}.title`, e.target.value);
    setFieldValue(`${baseName}.gender`, gender);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Card header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.tone}`}
          >
            {meta.icon}
          </span>
          <div>
            <p className="text-sm font-bold text-gray-800">
              {meta.label} {index + 1}
            </p>
            <p className="text-[11px] text-gray-400">{meta.sub}</p>
          </div>
        </div>
        {isLead && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Lead Traveler
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          label="Title"
          name={`${baseName}.title`}
          value={passenger.title}
          onChange={handleTitleChange}
          options={TITLE_OPTIONS}
          placeholder="Select title"
          required
        />
        <Input
          label="First Name"
          name={`${baseName}.firstname`}
          value={passenger.firstname}
          onChange={handleChange}
          placeholder="First name"
          required
        />
        <Input
          label="Last Name"
          name={`${baseName}.lastname`}
          value={passenger.lastname}
          onChange={handleChange}
          placeholder="Last name"
          required
        />
        <Select
          label="Gender"
          name={`${baseName}.gender`}
          value={passenger.gender}
          onChange={handleChange}
          options={GENDER_OPTIONS}
          placeholder="Select gender"
          required
        />
        <Input
          label="Date of Birth"
          type="date"
          iconLeft={<MdOutlineCalendarMonth />}
          name={`${baseName}.date_of_birth`}
          value={passenger.date_of_birth}
          onChange={handleChange}
          required
        />
        <Input
          label="Country"
          iconLeft={<FaGlobe />}
          name={`${baseName}.country`}
          value={passenger.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
        <Input
          label="Passport Number"
          iconLeft={<MdOutlineBadge />}
          name={`${baseName}.passport_number`}
          value={passenger.passport_number}
          onChange={handleChange}
          placeholder="Passport number"
          required
        />
        <Input
          label="Passport Expiry"
          type="date"
          iconLeft={<MdOutlineCalendarMonth />}
          name={`${baseName}.passport_expire`}
          value={passenger.passport_expire}
          onChange={handleChange}
          required
        />

        {isLead && (
          <>
            <Input
              label="Email"
              type="email"
              iconLeft={<MdOutlineMailOutline />}
              name={`${baseName}.email`}
              value={passenger.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            <Input
              label="Phone"
              type="tel"
              iconLeft={<MdOutlinePhone />}
              name={`${baseName}.phone`}
              value={passenger.phone}
              onChange={handleChange}
              placeholder="+880 1XXXXXXXXX"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default PassengerCard;