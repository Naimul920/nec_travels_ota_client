import React from "react";
import { FaBullhorn, FaStar } from "react-icons/fa";

type NoticeMarqueeProps = {
  notices?: string[];
};

const demoNotices = [
  "Welcome to Nec Travels : A sister concern of Nec Money Transfer Limited",
  "Eid Special Offer is Live Now",
  "New Visa Services Available",
];

const NoticeMarquee: React.FC<NoticeMarqueeProps> = ({
  notices = demoNotices,
}) => {
  return (
    <div className="container mx-auto  border border-secondary rounded-t-sm overflow-hidden bg-white flex items-center">
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-white font-semibold shrink-0">
        <FaBullhorn className="text-lg" />
        <span>Notice</span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-10 px-4">
          {notices.map((text, index) => (
            <div key={index} className="flex items-center gap-3 text-gray-700">
              <span>{text}</span>
              <div className="flex gap-1 text-secondary">
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticeMarquee;
