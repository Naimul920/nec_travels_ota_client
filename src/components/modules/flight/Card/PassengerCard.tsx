"use client";
import React from "react";
import { useFormikContext } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import { Input } from "@/components/ui";

interface Props {
  type: PassengerType;
  index: number;
}

const PassengerCard: React.FC<Props> = ({ type, index }) => {
  const { values, handleChange } = useFormikContext<BookingFormValues>();

  const baseName = `${type}.${index}`;

  return (
    <div className="border border-gray-500 p-4 rounded-md mt-3 bg-white">
      <h3 className="font-medium mb-2">
        {type.toUpperCase()} {index + 1}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <Input
          name={`${baseName}.title`}
          value={values[type][index].title}
          onChange={handleChange}
          placeholder="Title (Mr/Mrs/Ms)"
          required
        />

        <Input
          name={`${baseName}.gender`}
          value={values[type][index].gender}
          onChange={handleChange}
          placeholder="Gender (Male/Female)"
          required
        />

        <Input
          name={`${baseName}.firstname`}
          value={values[type][index].firstname}
          onChange={handleChange}
          placeholder="First Name"
          required
        />

        <Input
          name={`${baseName}.lastname`}
          value={values[type][index].lastname}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />

        <Input
          name={`${baseName}.date_of_birth`}
          type="date"
          value={values[type][index].date_of_birth}
          onChange={handleChange}
          placeholder="Date of Birth"
          required
        />

        <Input
          name={`${baseName}.country`}
          value={values[type][index].country}
          onChange={handleChange}
          placeholder="Country"
          required
        />

        <Input
          name={`${baseName}.passport_number`}
          value={values[type][index].passport_number}
          onChange={handleChange}
          placeholder="Passport Number"
          required
        />

        <Input
          name={`${baseName}.passport_expire`}
          type="date"
          value={values[type][index].passport_expire}
          onChange={handleChange}
          placeholder="Passport Expiry"
          required
        />

        <Input
          name={`${baseName}.email`}
          type="email"
          value={values[type][index].email}
          onChange={handleChange}
          placeholder="Email"
        />

        <Input
          name={`${baseName}.phone`}
          type="tel"
          value={values[type][index].phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
      </div>
    </div>
  );
};

export default PassengerCard;
