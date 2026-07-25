"use client";
import React, { useEffect } from "react";
import { useFormikContext, getIn } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import { Input } from "@/components/ui";

interface Props {
  type: PassengerType;
  index: number;
}

const PassengerCard: React.FC<Props> = ({ type, index }) => {
  const { values, handleChange, setFieldValue } =
    useFormikContext<BookingFormValues>();

  const baseName = `${type}.${index}`;

  const commonRequiredValue = getIn(values, "commonRequiredField") || "";
  const commonOptionalValue = getIn(values, "commonOptionalField") || "";

  useEffect(() => {
    if (commonRequiredValue) {
      setFieldValue(`${baseName}.title`, commonRequiredValue);
    }
    if (commonOptionalValue) {
      setFieldValue(`${baseName}.image`, commonOptionalValue);
    }
  }, [commonRequiredValue, commonOptionalValue, baseName, setFieldValue]);

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
          placeholder="Title (Required)"
          required
        />

        <Input
          name={`${baseName}.image`}
          value={values[type][index].image}
          onChange={handleChange}
          placeholder="Image URL (Optional)"
        />

        <Input
          name={`${baseName}.name`}
          value={values[type][index].name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />

        <Input
          name={`${baseName}.email`}
          value={values[type][index].email}
          onChange={handleChange}
          placeholder="Email"
        />

        <Input
          name={`${baseName}.phone`}
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
