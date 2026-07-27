import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
  {
    label: "Twitter",
    href: "#",
    path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
  },
  {
    label: "YouTube",
    href: "#",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

const learnMoreLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "How to Book", href: "#" },
  { label: "Help Center", href: "#" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const productLinks = [
  { label: "Flight", href: "#" },
  { label: "Hotel", href: "#" },
  { label: "Visa", href: "#" },
  { label: "Insurance", href: "#" },
  { label: "Activity", href: "#" },
];

const paymentMethods = [
  { label: "MC", class: "text-red-500 bg-black" },
  { label: "amazon", class: "text-orange-400 bg-[#1E2530]" },
  { label: "stripe", class: "text-white bg-[#635BFF]" },
  { label: "M", class: "text-blue-500 bg-black" },
  { label: "AMEX", class: "text-white bg-[#006FCF]" },
  { label: "PayPal", class: "text-white italic bg-[#003087]" },
];

function SocialIcon({ path }: { path: string }) {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d={path} />
    </svg>
  );
}

function AppDownloadButton({
  qrData,
  topText,
  bottomText,
  icon,
}: {
  qrData: string;
  topText: string;
  bottomText: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-[42px] h-[42px] bg-white p-1 rounded shrink-0">
        <Image
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`}
          alt="QR Code"
          width={42}
          height={42}
          unoptimized
        />
      </div>
      <button className="h-[42px] bg-white text-black px-3 rounded-md flex items-center gap-2 border hover:bg-gray-100 transition-colors">
        <span className="text-lg">{icon}</span>
        <div className="flex flex-col text-left leading-none">
          <span className="text-[8px] uppercase tracking-wider font-semibold">
            {topText}
          </span>
          <span className="text-[13px] font-bold">{bottomText}</span>
        </div>
      </button>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#1C1C1C] text-gray-300 pt-16 pb-8 select-none">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          <div className="lg:col-span-1 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/logo.png"
                alt="NEC Travels Logo"
                width={150}
                height={40}
                className="h-auto w-auto"
              />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[#00A550] font-semibold text-base">
              Learn More
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
              {learnMoreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[#00A550] font-semibold text-base">
              Products
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-300">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[#00A550] font-semibold text-base">
              Contact Us
            </h4>
            <p className="text-sm text-gray-300">Hotel Reservation:</p>
            <p className="text-sm text-gray-300 font-medium">
              Payment Method:
            </p>
            <div className="grid grid-cols-3 gap-2 w-fit">
              {paymentMethods.map((pm) => (
                <div
                  key={pm.label}
                  className={`w-[48px] h-[28px] border border-gray-700 rounded flex items-center justify-center text-[10px] font-bold ${pm.class}`}
                >
                  {pm.label}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-[#00A550] font-semibold text-base">Social</h4>
            <div className="flex items-center gap-3 text-white">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="hover:text-[#00A550] transition-colors"
                >
                  <SocialIcon path={social.path} />
                </Link>
              ))}
            </div>

            <p className="text-[13px] font-semibold text-white">
              Get Mobile App
            </p>

            <div className="flex flex-col gap-2">
              <AppDownloadButton
                qrData="playstore"
                topText="GET IT ON"
                bottomText="Google Play"
                icon="▶"
              />
              <AppDownloadButton
                qrData="appstore"
                topText="Download on the"
                bottomText="App Store"
                icon=""
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2025 NEC Travel. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
