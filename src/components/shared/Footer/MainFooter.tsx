import Link from "next/link";
import Image from "next/image";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
  background: string;
};

const socialLinks: SocialLink[] = [
  { label: "Facebook", href: "#", icon: FaFacebookF, background: "bg-[#1877F2]" },
  { label: "Instagram", href: "#", icon: FaInstagram, background: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
  { label: "X", href: "#", icon: FaXTwitter, background: "bg-[#000000]" },
  { label: "YouTube", href: "#", icon: FaYoutube, background: "bg-[#FF0000]" },
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#F5F1E8] after:mt-3 after:block after:h-[2px] after:w-8 after:rounded-full after:bg-brand">
      {children}
    </h4>
  );
}

export default function MainFooter() {
  return (
    <footer className="w-full bg-[#0B1F30] text-[#8FA6BC]">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start gap-5 sm:col-span-2 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/logo.png"
                alt="NEC Travels Logo"
                width={150}
                height={40}
                className="h-[40px] w-auto object-contain"
                priority
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
                    className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:scale-110 ${social.background}`}
                  >
                    <Icon className="text-[18px] text-white" />
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
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-white"
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
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-white"
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
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white">
                  <MdPhone />
                </span>
                <span className="text-[#F5F1E8]">+880 9613-774477</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white">
                  <MdEmail />
                </span>
                <span className="text-[#F5F1E8]">support@nectravels.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white">
                  <MdLocationOn />
                </span>
                <span className="text-[#F5F1E8]">Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pay With - full width image without top border */}
        <div className="py-6 ">
          <Image
            src="/assets/images/payment.png"
            alt="Payment Methods - SSLCommerz"
            width={1200}
            height={200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 text-xs text-[#6C89A1]">
          <p className="text-center">© 2026 NEC Travels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}