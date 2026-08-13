import React from "react";
import { useFormikContext, FieldArray } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import PassengerCard from "@/components/modules/flight/Card/PassengerCard";

const passengerTypes: PassengerType[] = ["adult", "child", "kid", "infant"];

interface TravelersFormProps {
  isDomestic?: boolean;
}

const TravelersForm: React.FC<TravelersFormProps> = ({
  isDomestic = false,
}) => {
  const { values } = useFormikContext<BookingFormValues>();

  return (
    <div className="space-y-4">
      {passengerTypes.map((type) => (
        <FieldArray key={type} name={type}>
          {() =>
            !values[type] || values[type].length === 0 ? null : (
              <div className="space-y-4">
                {values[type].map((_, index) => (
                  <PassengerCard
                    key={index}
                    type={type}
                    index={index}
                    isDomestic={isDomestic}
                  />
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