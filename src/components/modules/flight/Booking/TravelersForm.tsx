import React from "react";
import { useFormikContext, FieldArray } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import PassengerCard from "@/components/modules/flight/Card/PassengerCard";

const passengerTypes: PassengerType[] = ["adult", "child", "kid", "infant"];

const TravelersForm: React.FC = () => {
  const { values } = useFormikContext<BookingFormValues>();

  return (
    <>
      {passengerTypes.map((type) => (
        <FieldArray key={type} name={type}>
          {() => (
            <>
              {values[type].length > 0 && (
                <h2 className="text-lg font-medium mt-4 capitalize">
                  {type} Information
                </h2>
              )}

              {values[type].map((_, index) => (
                <PassengerCard key={index} type={type} index={index} />
              ))}
            </>
          )}
        </FieldArray>
      ))}
    </>
  );
};

export default TravelersForm;
