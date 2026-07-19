"use client"; // 1. Next.js 16 Client Component Boundary

import React, { useMemo } from "react";
// 2. Swapped React Router hook with Next.js Navigation hook
import { useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import { decoding } from "../../../utils";
import { Button, Input } from "../../ui";
import type { BookingFormValues } from "@/interface";
import TravelersForm from "../Booking/TravelersForm";
import { createPassengers } from "@/helper/createPassengers";

const FlightBooking: React.FC = () => {
  // 3. Read search parameters natively
  const searchParamsHook = useSearchParams();

  // Re-creates the URLSearchParams instance dynamically from Next.js searchParams hook
  const searchParams = useMemo(() => {
    return new URLSearchParams(searchParamsHook.toString());
  }, [searchParamsHook]);

  const searchInfoParams = useMemo(() => {
    const q = searchParams.get("q");
    return q
      ? new URLSearchParams(decoding(q) as string)
      : new URLSearchParams();
  }, [searchParams]);

  const initialValues: BookingFormValues = {
    tripType: searchInfoParams.get("tripType"),
    cabin: searchInfoParams.get("cabin"),
    adult: createPassengers(Number(searchInfoParams.get("adult") ?? 0)),
    child: createPassengers(Number(searchInfoParams.get("child") ?? 0)),
    kid: createPassengers(Number(searchInfoParams.get("kid") ?? 0)),
    infant: createPassengers(Number(searchInfoParams.get("infant") ?? 0)),
  };

  const handleSubmit = (values: BookingFormValues) => {
    console.log("FINAL FORM DATA 👉", values);
  };

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Flight Booking</h1>

      <Formik
        initialValues={{
          ...initialValues,
          commonRequiredField: "", // Example: "Title" required for all
          commonOptionalField: "", // Example: "Image URL" optional for all
        }}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form>
            {/* Common fields */}
            <div className="mb-4">
              <Input
                name="commonRequiredField"
                value={values.commonRequiredField}
                onChange={handleChange}
                placeholder="Title for all (Required)"
                required
              />
              <br />
              <Input
                name="commonOptionalField"
                value={values.commonOptionalField}
                onChange={handleChange}
                placeholder="Image URL for all (Optional)"
              />
            </div>

            <TravelersForm />
            <Button type="submit" className="mt-6">
              Submit Booking
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default FlightBooking;
