import React from "react";
import { useFormikContext, FieldArray } from "formik";
import type { PassengerType } from "@/types/passengerAlertBank";
import type { BookingFormValues } from "@/interface";
import PassengerCard from "@/components/modules/flight/Card/PassengerCard";
import { FaUser, FaUserFriends, FaChild, FaBaby } from "react-icons/fa";

const passengerTypes: {
  type: PassengerType;
  label: string;
  icon: React.ReactNode;
  tone: string;
}[] = [
  {
    type: "adult",
    label: "Adult Information",
    icon: <FaUser />,
    tone: "bg-primary/10 text-primary",
  },
  {
    type: "child",
    label: "Child Information",
    icon: <FaUserFriends />,
    tone: "bg-secondary/10 text-secondary",
  },
  {
    type: "kid",
    label: "Kid Information",
    icon: <FaChild />,
    tone: "bg-amber-50 text-amber-500",
  },
  {
    type: "infant",
    label: "Infant Information",
    icon: <FaBaby />,
    tone: "bg-gray-100 text-gray-500",
  },
];

const TravelersForm: React.FC = () => {
  const { values } = useFormikContext<BookingFormValues>();

  return (
    <>
      <div className="mb-4 flex items-center gap-3 rounded-xl bg-primary/5 px-5 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
          <FaUserFriends />
        </span>
        <div>
          <p className="text-base font-bold text-gray-800">Travelers</p>
          <p className="text-xs text-gray-500">
            Please fill in the required details for each traveler
          </p>
        </div>
      </div>

      {passengerTypes.map(({ type, label, icon, tone }) => (
        <FieldArray key={type} name={type}>
          {() =>
            values[type].length === 0 ? null : (
              <section className="mt-7">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}
                  >
                    {icon}
                  </span>
                  <h2 className="text-base font-bold text-gray-800 capitalize">
                    {label}
                  </h2>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                    {values[type].length}
                  </span>
                </div>

                <div className="space-y-4">
                  {values[type].map((_, index) => (
                    <PassengerCard key={index} type={type} index={index} />
                  ))}
                </div>
              </section>
            )
          }
        </FieldArray>
      ))}
    </>
  );
};

export default TravelersForm;