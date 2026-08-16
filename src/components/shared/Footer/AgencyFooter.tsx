import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function AgencyFooter() {
  return (
    <aside aria-label="Quick Contact Bar" className="w-full border-y border-white/20 bg-primary">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5  text-xs text-white sm:text-sm">
        
        {/* Phone Section */}
        <div className="flex items-center gap-2">
          <FaPhone className="h-3.5 w-3.5 shrink-0 text-white" aria-hidden="true" />
          <span className="font-medium">Support (24x7):</span>
          <div className="flex flex-wrap items-center gap-x-2">
            <a 
              href="tel:+8801319992605" 
              className="transition-colors hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              +88 01319992605
            </a>
            <span className="opacity-50">|</span>
            <a 
              href="tel:+88028396952" 
              className="transition-colors hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              +88 02 8396952-3
            </a>
            <span className="opacity-50">|</span>
            <a 
              href="tel:+88028399950" 
              className="transition-colors hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              8399950
            </a>
            <span className="opacity-50">|</span>
            <a 
              href="tel:+88028399960" 
              className="transition-colors hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              8399960
            </a>
          </div>
        </div>

        {/* Separator */}
        <span aria-hidden="true" className="hidden h-4 w-px bg-white/30 sm:block" />

        {/* Email Section */}
        <div className="flex items-center gap-2">
          <MdEmail className="h-4 w-4 shrink-0 text-white" aria-hidden="true" />
          <a
            href="mailto:info@nectravelsltd.com"
            className="transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            info@nectravelsltd.com
          </a>
        </div>

      </div>
    </aside>
  );
}