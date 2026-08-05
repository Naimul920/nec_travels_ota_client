import { FaMailchimp, FaPhone } from "react-icons/fa6";


export default function AgencyFooter() {
  return (
    <div className="w-full border-y border-white/30 bg-primary">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2.5 text-xs text-white sm:text-sm">
        <FaPhone className="h-3.5 w-3.5 shrink-0 fill-white" />
        <span className="whitespace-nowrap">
          Support ( 24x7 ) &nbsp;+88 01319992605 &nbsp;+88 02 8396952-3,
          &nbsp;8399950, 8399960
        </span>

        <span className="mx-2 hidden h-3.5 w-px bg-white/40 sm:block" />

        <FaMailchimp className="h-3.5 w-3.5 shrink-0" />
        <a
          href="mailto:info@nectravelsltd.com"
          className="whitespace-nowrap hover:underline"
        >
          info@nectravelsltd.com
        </a>
      </div>
    </div>
  );
}