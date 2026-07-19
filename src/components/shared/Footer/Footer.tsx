import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="bg-primary border-t-2 border-t-white md:p-5 p-3 z-9">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:max-w-3xl mx-auto">
        {/* Phone Section */}
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <FaPhoneAlt
            className="bg-white text-primary p-1 rounded-full"
            size={20}
          />
          <div className="flex items-center md:gap-3 gap-1">
            <p className="text-white text-xs">Support (24x7)</p>
            <p className="text-white text-xs">
              <Link href="tel:+8801319992605">+88 01319992605</Link>
            </p>
            <p className="text-white text-xs hidden sm:block">
              +88 02 8396952-3, 8399950, 8399960
            </p>
          </div>
        </div>

        {/* Mail Section */}
        <div className="flex items-center gap-2">
          <MdMail
            className="bg-white text-primary p-1 rounded-full"
            size={20}
          />
          <p className="text-white text-xs">
            <Link href="mailto:info@nectravelsltd.com">
              info@nectravelsltd.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
