import React from "react";

export default function RefundPolicy() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Refund, Cancellation & Void Policy
          </h1>
          <p className="text-gray-600">
            Please read our refund, cancellation, and void policies carefully
            before purchasing any travel-related services from NEC Travels.
          </p>
        </div>

        <div className="space-y-8">
          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              1. Air Ticket Cancellation
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                Air ticket cancellation is subject to the fare rules and
                conditions of the respective airline.
              </li>
              <li>
                Cancellation charges imposed by the airline, along with any
                applicable service charges, will be deducted from the refundable
                amount.
              </li>
              <li>
                Some promotional or special fare tickets may be non-refundable.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              2. Air Ticket Refund
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                Refund requests must be submitted through our office or official
                communication channels.
              </li>
              <li>
                Refunds will only be processed after receiving approval from the
                respective airline or service provider.
              </li>
              <li>
                Refund processing may take 15–45 working days depending on the
                airline’s refund policy.
              </li>
              <li>
                The refunded amount will be transferred using the original
                payment method whenever possible.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              3. Ticket Void Policy
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                Ticket void requests are accepted only if the airline’s void
                policy allows them.
              </li>
              <li>
                Generally, a ticket can be voided only on the same day of
                issuance before the airline’s deadline.
              </li>
              <li>
                Once a ticket is successfully voided, no cancellation fee will
                apply unless otherwise specified by the airline.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              4. Hotel & Tour Package Cancellation
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                Hotel and tour package cancellations are subject to the policy
                of the respective hotel, supplier, or tour operator.
              </li>
              <li>
                Any non-refundable deposits or supplier charges will be deducted
                from the refund amount.
              </li>
              <li>
                Customized packages may be partially or fully non-refundable
                after confirmation.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              5. Visa Processing Fees
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                Visa processing fees, embassy fees, appointment fees, and
                service charges are non-refundable once the application process
                has started.
              </li>
              <li>
                Visa approval or rejection is solely at the discretion of the
                respective Embassy or Consulate.
              </li>
              <li>
                NEC Travels is not responsible for visa decisions.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              6. No-Show Policy
            </h2>

            <p className="text-gray-700">
              No refund will be provided for passengers or travelers who fail to
              use the booked service without prior cancellation, subject to
              airline or supplier rules.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold">
              7. Payment Gateway Refunds
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                Refunds for online payments will be processed through the
                original payment method.
              </li>
              <li>
                Payment gateway transaction fees, if applicable, may be deducted
                from the refundable amount.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}