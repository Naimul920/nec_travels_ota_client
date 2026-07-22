import React from "react";

export default function AboutUs() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            About NEC Travels
          </h1>

          <p className="text-gray-600">
            Your trusted travel partner for domestic and international travel
            solutions.
          </p>
        </div>

        <div className="space-y-8">
          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Who We Are</h2>

            <p className="leading-8 text-gray-700">
              NEC Travels is a brand name of NEC Express Ltd. We provide a full
              range of travel-related services to commercial and individual
              clients in Bangladesh, Italy, and England.
            </p>

            <p className="mt-4 leading-8 text-gray-700">
              Established in 2019, NEC Travels is an IATA-accredited agency.
              Since our inception, we have successfully served a large number of
              corporate and B2C customers.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Our Digital Journey
            </h2>

            <p className="leading-8 text-gray-700">
              To keep pace with modern technology, NEC Travels has launched its
              own digital B2B and B2C platform under
              <span className="font-semibold"> nectravelsltd.com</span>.
            </p>

            <p className="mt-4 leading-8 text-gray-700">
              Through our online portal, customers can access:
            </p>

            <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-gray-700">
              <li>✈️ Air Tickets</li>
              <li>🏨 Hotel Booking</li>
              <li>🧳 Tour Packages</li>
              <li>🕋 Umrah & Hajj Packages</li>
              <li>🚆 Indian Rail Tickets</li>
              <li>🌍 Travel Assistance Services</li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Expansion & Growth
            </h2>

            <p className="leading-8 text-gray-700">
              Our commitment to customer satisfaction and exceptional travel
              experiences has driven our continuous growth and transformation.
            </p>

            <p className="mt-4 leading-8 text-gray-700">
              To better serve our clients, we have expanded our team of skilled
              travel professionals with extensive knowledge and industry
              experience.
            </p>

            <p className="mt-4 leading-8 text-gray-700">
              Our experts handle every aspect of travel planning—from itinerary
              creation to on-the-ground support—ensuring personalized and
              attentive service for every traveler.
            </p>
          </div>

          <div className="rounded-xl bg-primary/5 p-6">
            <h2 className="mb-3 text-xl font-semibold">
              Our Mission
            </h2>

            <p className="leading-8 text-gray-700">
              To provide reliable, innovative, and customer-focused travel
              services through modern technology while maintaining the highest
              standards of professionalism and care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}