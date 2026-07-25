import React from "react";

export default function PrivacyPolicy() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            Privacy Policy
          </h1>

          <p className="text-gray-600">
            At NEC Travels (NEC Express Limited), your privacy is important to
            us. We are committed to protecting your personal information and
            ensuring that it is handled responsibly.
          </p>
        </div>

        <div className="space-y-8">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Information We Collect
            </h2>

            <p className="text-gray-700">
              To make reservations and bookings, we may collect personal
              information including:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
              <li>Full name and address.</li>
              <li>Phone number and email address.</li>
              <li>Credit and debit card information.</li>
              <li>Passport number and age.</li>
              <li>Social media profile links.</li>
              <li>Travel preferences and booking details.</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              How We Use Your Information
            </h2>

            <ul className="list-disc space-y-2 pl-5 text-gray-700">
              <li>
                Processing airline tickets, hotel bookings, visa applications,
                and tour packages.
              </li>
              <li>Communicating service updates and booking information.</li>
              <li>Improving website functionality and customer experience.</li>
              <li>Marketing and promotional activities.</li>
              <li>Providing customer support and assistance.</li>
            </ul>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Sharing of Information
            </h2>

            <p className="text-gray-700">
              Your information may be shared with airlines, hotels, visa
              agencies, tour operators, and other service providers when
              necessary to complete your booking.
            </p>

            <p className="mt-4 text-gray-700">
              We may also disclose information if required by law, government
              authorities, or to protect our legal rights.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Cookies & Third-Party Services
            </h2>

            <p className="text-gray-700">
              Third-party advertisers and websites are not covered by this
              privacy policy. Their own privacy policies and cookie policies may
              apply.
            </p>

            <p className="mt-4 text-gray-700">
              You can disable cookies through your browser settings. Please
              visit your browser’s support website for detailed instructions.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Data Security</h2>

            <p className="text-gray-700">
              We apply appropriate organizational, technical, and operational
              measures to protect your personal information.
            </p>

            <p className="mt-4 text-gray-700">
              If you believe that your account or interactions with us are no
              longer secure, please contact us immediately.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}