import Link from "next/link";
import Image from "next/image";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa6";

import type { IconType } from "react-icons";
import { FlightRoute } from "../FlightRoute/FlightRoute";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";
type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
  background: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    href: "#",
    icon: FaFacebookF,
    background: "#1877F2",
  },
  {
    label: "Instagram",
    href: "#",
    icon: FaInstagram,
    background: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)",
  },
  {
    label: "X",
    href: "#",
    icon: FaXTwitter,
    background: "#000000",
  },
  {
    label: "YouTube",
    href: "#",
    icon: FaYoutube,
    background: "#FF0000",
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
  { label: "MC", className: "text-red-400 bg-[#0B1F30]" },
  { label: "amazon", className: "text-[#F2A93B] bg-[#0B1F30]" },
  { label: "stripe", className: "text-white bg-[#635BFF]" },
  { label: "M", className: "text-sky-400 bg-[#0B1F30]" },
  { label: "AMEX", className: "text-white bg-[#006FCF]" },
  { label: "PayPal", className: "text-white italic bg-[#003087]" },
];

const appStores = [
  {
    qrData: "playstore",
    topText: "GET IT ON",
    name: "Google Play",
    icon: <FaGooglePlay className="h-4 w-4" />,
  },
  {
    qrData: "appstore",
    topText: "Download on the",
    name: "App Store",
    icon: <FaApple className="h-4 w-4" />,
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#F5F1E8] after:mt-3 after:block after:h-[2px] after:w-8 after:rounded-full after:bg-brand">
      {children}
    </h4>
  );
}

export default function Footer() {
  const { user } = useAuthStore();
  return (
    <footer className="w-full bg-[#0B1F30] text-[#8FA6BC]">
      <FlightRoute />
      {user?.role == ROLE.B2B ? (
        <div>agency footer</div>
      ) : (
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-12">
          {/* Main grid */}
          <div className="grid grid-cols-1 gap-10 pb-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
            {/* Brand */}
            <div className="flex flex-col items-start gap-5 sm:col-span-2 lg:col-span-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/assets/images/logo.png"
                  alt="NEC Travels Logo"
                  width={150}
                  height={40}
                  className="h-auto w-auto"
                />
              </Link>

              <p className="max-w-xs text-sm leading-6 text-[#8FA6BC]">
                Discover and book unique travel experiences — flights, hotels,
                visas and more — all in one place with NEC Travels.
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      style={{ background: social.background }}
                      className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-110"
                    >
                      <Icon className="text-[20px] text-white" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Learn More */}
            <div className="lg:col-span-2">
              <SectionHeading>Learn More</SectionHeading>
              <ul className="flex flex-col gap-3 text-sm">
                {learnMoreLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-[#8FA6BC]! transition-all duration-200 hover:translate-x-1 hover:text-brand! focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div className="lg:col-span-2">
              <SectionHeading>Products</SectionHeading>
              <ul className="flex flex-col gap-3 text-sm">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-[#8FA6BC]! transition-all duration-200 hover:translate-x-1 hover:text-brand! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="sm:col-span-2 lg:col-span-4">
              <SectionHeading>Contact Us</SectionHeading>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <MdPhone />
                  </span>
                  <span className="text-[#F5F1E8]">+880 9613-774477</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <MdEmail />
                  </span>
                  <span className="text-[#F5F1E8]">support@nectravels.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <MdLocationOn />
                  </span>
                  <span className="text-[#F5F1E8]">Dhaka, Bangladesh</span>
                </li>
              </ul>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6C89A1]">
                We Accept
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {paymentMethods.map((pm) => (
                  <span
                    key={pm.label}
                    className={`flex h-7 items-center justify-center rounded-md border border-white/10 px-2 text-[10px] font-bold ${pm.className}`}
                  >
                    {pm.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* App banner */}
          {/* <div className="mb-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:flex-row md:px-8">
          <div className="text-center md:text-left">
            <p className="text-lg font-bold text-[#F5F1E8]">
              Get the NEC Travels App
            </p>
            <p className="mt-1 text-sm text-[#8FA6BC]">
              Book flights and manage trips on the go.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            {appStores.map((store) => (
              <a
                key={store.name}
                href="#"
                className="flex w-full items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-black shadow-sm transition hover:bg-gray-100 sm:w-auto"
              >
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${store.qrData}`}
                  alt={`${store.name} QR Code`}
                  width={40}
                  height={40}
                  unoptimized
                  className="h-10 w-10 rounded"
                />
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                    {store.topText}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                    {store.icon} {store.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div> */}

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#6C89A1] md:flex-row">
            <p>© 2025 NEC Travel. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="transition-colors hover:text-[#F2A93B]">
                Terms of Service
              </Link>
              <Link href="#" className="transition-colors hover:text-[#F2A93B]">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
