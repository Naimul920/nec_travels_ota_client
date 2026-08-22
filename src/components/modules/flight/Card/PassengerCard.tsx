"use client";
import React, { useState } from "react";
import type { ReactNode } from "react";
import { useFormikContext } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import { useAuthStore } from "@/store/auth.store";
import {
  Input,
  Select,
  DatePicker,
  PhoneInput,
  CountrySelect,
} from "@/components/ui";
import {
  getDateOfBirthDisabledDate,
  getPassportExpiryDisabledDate,
} from "@/utils/passengerAge";
import { FaUser, FaUserFriends, FaChild, FaBaby } from "react-icons/fa";
import SavedPassengerSearch from "./SavedPassengerSearch";
import type { SavedPassenger } from "@/actions/booking.action";

interface Props {
  type: PassengerType;
  index: number;
  isDomestic?: boolean;
}

const TYPE_META: Record<
  PassengerType,
  { label: string; sub: string; icon: ReactNode; tone: string }
> = {
  adult: {
    label: "Adult",
    sub: "12 years & above",
    icon: <FaUser />,
    tone: "bg-blue-600 text-white",
  },
  child: {
    label: "Child",
    sub: "7 to 11 years",
    icon: <FaUserFriends />,
    tone: "bg-emerald-600 text-white",
  },
  kid: {
    label: "Kid",
    sub: "2 to 6 years",
    icon: <FaChild />,
    tone: "bg-amber-500 text-white",
  },
  infant: {
    label: "Infant",
    sub: "0 to 2 year",
    icon: <FaBaby />,
    tone: "bg-gray-500 text-white",
  },
};

const getTitleOptions = () =>
  ["Mr", "Mrs", "Ms"].map((t) => ({ label: t, value: t }));
const GENDER_OPTIONS = ["Male", "Female"].map((g) => ({ label: g, value: g }));

const PassengerCard: React.FC<Props> = ({
  type,
  index,
  isDomestic = false,
}) => {
  const { values, errors, handleChange, setFieldValue } =
    useFormikContext<BookingFormValues>();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSavedPassengerSelect = (p: SavedPassenger) => {
    const set = (field: string, val: string) =>
      setFieldValue(`${baseName}.${field}`, val ?? "");
    set("title", p.title);
    set("firstname", p.first_name);
    set("lastname", p.last_name);
    set("gender", p.gender);
    set("date_of_birth", p.date_of_birth);
    set("country", p.country);
    if (!isDomestic) {
      set("passport_number", p.passport_number);
      set("passport_expire", p.passport_expire);
    }
    set("email", p.email);
    set("phone", p.phone);
  };

  const meta = TYPE_META[type];
  const baseName = `${type}.${index}`;
  const passenger = values[type][index];
  const isLeadPassenger = type === "adult" && index === 0;
  const titleOptions = getTitleOptions();

  const err = (field: string) => {
    const flat = errors as Record<string, string | undefined>;
    const msg = flat[`${baseName}.${field}`];
    return { error: Boolean(msg), errorMessage: msg };
  };

  const dateOfBirthDisabledDate = getDateOfBirthDisabledDate(type);
  const passportExpiryDisabledDate = getPassportExpiryDisabledDate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const title = e.target.value;
    const gender = title === "Mr" ? "Male" : "Female";
    setFieldValue(`${baseName}.title`, title);
    setFieldValue(`${baseName}.gender`, gender);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.tone}`}>{meta.icon}</span>
          <div><h3 className="text-sm font-bold text-[#12233D]">{meta.label} {index + 1}</h3><p className="mt-0.5 text-[11px] text-slate-400">{meta.sub}</p></div>
          <span
            className="hidden rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200 sm:inline-flex"
          >
            Traveler {index + 1}
          </span>
          {isLeadPassenger && (
            <span
              className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold text-brand"
            >
              Lead Passenger
            </span>
          )}
        </div>

        {/* Quick Search Field */}
        <SavedPassengerSearch
          value={searchTerm}
          onChange={setSearchTerm}
          onSelect={handleSavedPassengerSelect}
          userId={user?.id}
          className="w-full sm:w-72"
        />
      </div>

      {/* Form Fields Grid matching exact 4-column design */}
      <div className="p-4 sm:p-5">
      <p className="mb-4 text-xs leading-5 text-slate-500">Use the traveler’s official name. Avoid initials unless they appear on the travel document.</p>
      <div className="grid grid-cols-1 gap-4 uppercase sm:grid-cols-2 xl:grid-cols-4 [&_label]:normal-case">
        {/* Row 1 */}
        <Select
          label="Title"
          name={`${baseName}.title`}
          value={passenger.title}
          onChange={handleTitleChange}
          options={titleOptions}
          placeholder="Select Title"
          required
          {...err("title")}
        />

        <Input
          label="First Name"
          name={`${baseName}.firstname`}
          value={passenger.firstname}
          onChange={handleChange}
          placeholder="FIRST NAME"
          required
          {...err("firstname")}
        />

        <Input
          label="Last Name"
          name={`${baseName}.lastname`}
          value={passenger.lastname}
          onChange={handleChange}
          placeholder="LAST NAME"
          required
          {...err("lastname")}
        />

        <Select
          label="Gender"
          name={`${baseName}.gender`}
          value={passenger.gender}
          onChange={handleChange}
          options={GENDER_OPTIONS}
          placeholder="Select Gender"
          required
          {...err("gender")}
        />

        {/* Row 2 */}
        <DatePicker
          label="Date of Birth"
          name={`${baseName}.date_of_birth`}
          value={passenger.date_of_birth}
          onChange={(v) => setFieldValue(`${baseName}.date_of_birth`, v)}
          placeholder="DD/MM/YYYY"
          format="DD/MM/YYYY"
          disabledDate={dateOfBirthDisabledDate}
          required
          {...err("date_of_birth")}
        />

        <CountrySelect
          label="Country"
          name={`${baseName}.country`}
          value={passenger.country}
          onChange={(v) => setFieldValue(`${baseName}.country`, v)}
          placeholder="Select Country"
          required
          {...err("country")}
        />

        {/* Row 3 — passport fields are hidden for domestic flights */}
        {!isDomestic && (
          <>
            <Input
              label="Passport Number"
              name={`${baseName}.passport_number`}
              value={passenger.passport_number}
              onChange={handleChange}
              placeholder="PASSPORT NUMBER"
              required
              {...err("passport_number")}
            />

            <DatePicker
              label="Passport Expiry Date"
              name={`${baseName}.passport_expire`}
              value={passenger.passport_expire}
              onChange={(v) =>
                setFieldValue(`${baseName}.passport_expire`, v)
              }
              placeholder="DD/MM/YYYY"
              format="DD/MM/YYYY"
              disabledDate={passportExpiryDisabledDate}
              required
              {...err("passport_expire")}
            />
          </>
        )}

        {isLeadPassenger && (
          <>
            <Input
              label="Email"
              type="email"
              name={`${baseName}.email`}
              value={passenger.email}
              onChange={handleChange}
              placeholder="EMAIL ADDRESS"
              required
              className="lg:col-span-2"
              {...err("email")}
            />

            <PhoneInput
              label="Phone Number"
              name={`${baseName}.phone`}
              value={passenger.phone}
              onChange={(v) => setFieldValue(`${baseName}.phone`, v)}
              placeholder="PHONE NUMBER"
              required
              className="lg:col-span-2"
              {...err("phone")}
            />
          </>
        )}
      </div>
      </div>
    </section>
  );
};

export default PassengerCard;
