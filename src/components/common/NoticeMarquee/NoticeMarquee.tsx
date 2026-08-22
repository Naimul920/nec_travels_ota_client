import { FaBullhorn } from "react-icons/fa";

type NoticeMarqueeProps = {
  notices?: string[];
};

const demoNotices = [
  "Welcome to Nec Travels : A sister concern of Nec Money Transfer Limited",
  "Eid Special Offer is Live Now",
  "New Visa Services Available",
];

export default function NoticeMarquee({
  notices = demoNotices,
}: NoticeMarqueeProps) {
  const visibleNotices = notices.filter((notice) => notice.trim().length > 0);

  if (visibleNotices.length === 0) return null;

  return (
    <aside
      aria-label="Travel updates"
      className="flex min-h-11 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex shrink-0 items-center gap-2 bg-[#12233D] px-3 text-sm font-semibold text-white sm:px-4">
        <FaBullhorn aria-hidden="true" className="text-secondary" />
        <span className="hidden sm:inline">Updates</span>
      </div>

      <div className="relative min-w-0 flex-1 overflow-hidden">
        <div className="animate-marquee flex min-h-11 w-max items-center whitespace-nowrap px-4 motion-reduce:animate-none">
          {visibleNotices.map((text, index) => (
            <div key={`${text}-${index}`} className="flex items-center text-sm text-slate-600">
              {index > 0 && (
                <span aria-hidden="true" className="mx-6 h-1.5 w-1.5 rounded-full bg-secondary/70" />
              )}
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
      </div>
    </aside>
  );
}
