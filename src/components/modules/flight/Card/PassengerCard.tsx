"use client";
import React, { useState } from "react";
import type { ReactNode } from "react";
import { useFormikContext } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import { useAuthStore } from "@/store/auth.store";
import { Input, Select, DatePicker, PhoneInput, CountrySelect } from "@/components/ui";
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

const TITLE_OPTIONS = ["Mr", "Mrs", "Ms"].map((t) => ({ label: t, value: t }));
const GENDER_OPTIONS = ["Male", "Female"].map((g) => ({ label: g, value: g }));

const PassengerCard: React.FC<Props> = ({ type, index }) => {
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
    set("passport_number", p.passport_number);
    set("passport_expire", p.passport_expire);
    set("email", p.email);
    set("phone", p.phone);
  };

  const meta = TYPE_META[type];
  const baseName = `${type}.${index}`;
  const passenger = values[type][index];

  const err = (field: string) => {
    const flat = errors as Record<string, string | undefined>;
    const msg = flat[`${baseName}.${field}`];
    return { error: Boolean(msg), errorMessage: msg };
  };

  const dateOfBirthDisabledDate = getDateOfBirthDisabledDate(type);
  const passportExpiryDisabledDate = getPassportExpiryDisabledDate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const gender = e.target.value === "Mr" ? "Male" : "Female";
    setFieldValue(`${baseName}.title`, e.target.value);
    setFieldValue(`${baseName}.gender`, gender);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all">
      {/* Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">Passenger Info</h3>
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold ${meta.tone}`}
          >
            {meta.label} {index + 1}
          </span>
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Row 1 */}
        <Select
          label="Title"
          name={`${baseName}.title`}
          value={passenger.title}
          onChange={handleTitleChange}
          options={TITLE_OPTIONS}
          placeholder="Select Passenger Type"
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
          placeholder="Select Passenger Type"
          required
          {...err("gender")}
        />

        {/* Row 2 */}
        <DatePicker
          label="Date of Birth"
          name={`${baseName}.date_of_birth`}
          value={passenger.date_of_birth}
          onChange={(v) => setFieldValue(`${baseName}.date_of_birth`, v)}
          placeholder="YYYY-MM-DD"
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

        <Input
          label="Email"
          type="email"
          name={`${baseName}.email`}
          value={passenger.email}
          onChange={handleChange}
          placeholder="EMAIL ADDRESS"
          required
          {...err("email")}
        />

        <PhoneInput
          label="Phone Number"
          name={`${baseName}.phone`}
          value={passenger.phone}
          onChange={(v) => setFieldValue(`${baseName}.phone`, v)}
          placeholder="PHONE NUMBER"
          required
          {...err("phone")}
        />

        {/* Row 3 */}
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
          onChange={(v) => setFieldValue(`${baseName}.passport_expire`, v)}
          placeholder="YYYY-MM-DD"
          disabledDate={passportExpiryDisabledDate}
          required
          {...err("passport_expire")}
        />
      </div>
    </div>
  );
};

export default PassengerCard;