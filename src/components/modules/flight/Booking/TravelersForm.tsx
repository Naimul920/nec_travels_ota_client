import React from "react";
import { useFormikContext, FieldArray } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import PassengerCard from "@/components/modules/flight/Card/PassengerCard";

const passengerTypes: PassengerType[] = ["adult", "child", "kid", "infant"];

const TravelersForm: React.FC = () => {
  const { values } = useFormikContext<BookingFormValues>();

  return (
    <div className="space-y-4">
      {passengerTypes.map((type) => (
        <FieldArray key={type} name={type}>
          {() =>
            !values[type] || values[type].length === 0 ? null : (
              <div className="space-y-4">
                {values[type].map((_, index) => (
                  <PassengerCard key={index} type={type} index={index} />
                ))}
              </div>
            )
          }
        </FieldArray>
      ))}
    </div>
  );
};

export default TravelersForm;