"use client";

import React, { useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { LuBuilding2 } from "react-icons/lu";
import { FiFileText } from "react-icons/fi";
import { MdFlight, MdHealthAndSafety, MdHolidayVillage } from "react-icons/md";
import { FaKaaba } from "react-icons/fa";
import clsx from "clsx";
import { TabPane, Tabs } from "@/components/ui";
import { Flight } from "@/components/modules/flight";
import { useAuthStore } from "@/store/auth.store";
import { ROLE } from "@/constant";

const ComingSoon: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-10 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 text-2xl text-brand">
      {icon}
    </span>
    <p className="text-base font-bold text-[#12233D]">{title} is coming soon</p>
    <p className="max-w-sm text-sm leading-6 text-slate-500">
      This service is being prepared. Flight booking remains available now.
    </p>
  </div>
);

type HomeTabsProps = {
  variant?: "landing" | "dashboard";
};

export default function HomeTabs({ variant = "landing" }: HomeTabsProps) {
  const [activeKey, setActiveKey] = useState("1");
  const [isPending, startTransition] = useTransition();
  const { user, isLoggedIn } = useAuthStore();
  const pathname = usePathname();

  // Hero video rules:
  // - Public landing page: shown for guests and B2C users.
  // - Dashboard (`/console/...`) routes: shown ONLY for B2C accounts. The
  //   "logged out" state must not flip it on here — when a logged-in admin/B2B
  //   user clicks logout, `clearUser()` runs before the redirect completes, and
  //   a truthy `!isLoggedIn` would instantly reveal the hidden video in the
  //   dashboard background. Route-gating keeps it hidden during that window.
  const isDashboard = pathname?.startsWith("/console") ?? false;
  const isDashboardVariant = variant === "dashboard";
  const showHero = isDashboard
    ? user?.role === ROLE.B2C
    : !isLoggedIn || user?.role === ROLE.B2C;

  const handleTabChange = (key: string) => {
    startTransition(() => setActiveKey(key));
  };

  return (
    <section
      className={clsx(
        "relative w-full",
        isDashboardVariant
          ? "bg-transparent pb-6 sm:pb-8"
          : "bg-white pb-14 sm:pb-18 lg:pb-24",
      )}
    >
      {/* Hero video: for B2C users and guests (not logged in). Kept mounted and
          never `display:none` (nor zero-height + overflow-hidden), since both make
          the browser pause/reset the video and cause the blink on login/logout.
          When hidden, the inner hero keeps its real size but is `invisible`
          (visibility:hidden does NOT pause media), while the outer 0-height
          wrapper collapses the space so the tabs panel sits at the top. */}
      <div
        className={clsx("relative", showHero ? "" : "h-0 overflow-visible")}
      >
        <div
          className={clsx(
            "relative h-[320px] w-full overflow-hidden bg-[#0b1727] sm:h-[380px] lg:h-[460px]",
            !showHero && "invisible"
          )}
        >
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src="/assets/videos/1746430357291.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07111f]/45 via-[#07111f]/10 to-[#07111f]/55" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>

      {/* Floating panel straddling the video bottom edge */}
      <div
        className={clsx(
          "relative z-10 mx-auto w-full",
          isDashboardVariant
            ? "max-w-none px-0"
            : "max-w-7xl px-4 sm:px-6 lg:px-8",
          showHero && "-mt-20 sm:-mt-24 lg:-mt-32"
        )}
      >
        <div
          className={clsx(
            "relative z-40 border border-slate-200/80 bg-white/95 p-3 backdrop-blur-xl sm:p-4",
            isDashboardVariant
              ? "rounded-[28px] shadow-[0_18px_45px_-32px_rgba(15,35,61,0.35)]"
              : "rounded-[28px] shadow-[0_24px_70px_-24px_rgba(15,35,61,0.35)]",
            !showHero && "mt-6"
          )}
        >
          <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            isPending={isPending}
            floating={showHero || isDashboardVariant}
            className="relative z-10 flex flex-col items-center justify-center"
            containerClassName="w-full lg:w-auto"
          >
            <TabPane key="1" tab="Flight" icon={<MdFlight size={20} />}>
              <Flight />
            </TabPane>

            <TabPane key="2" tab="Hotel" icon={<LuBuilding2 size={20} />}>
              <ComingSoon
                icon={<LuBuilding2 size={26} />}
                title="Hotel Booking"
              />
            </TabPane>

            <TabPane key="3" tab="Visa" icon={<FiFileText size={20} />}>
              <ComingSoon
                icon={<FiFileText size={26} />}
                title="Visa Information"
              />
            </TabPane>

            {/* <TabPane
              key="4"
              tab="Holiday"
              icon={<MdHolidayVillage size={20} />}
            >
              <ComingSoon
                icon={<MdHolidayVillage size={26} />}
                title="Holiday Package"
              />
            </TabPane> */}

            <TabPane key="5" tab="Umrah" icon={<FaKaaba size={20} />}>
              <ComingSoon icon={<FaKaaba size={26} />} title="Umrah Package" />
            </TabPane>

            {/* <TabPane
              key="6"
              tab="Insurance"
              icon={<MdHealthAndSafety size={20} />}
            >
              <ComingSoon
                icon={<MdHealthAndSafety size={26} />}
                title="Travel Insurance"
              />
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
