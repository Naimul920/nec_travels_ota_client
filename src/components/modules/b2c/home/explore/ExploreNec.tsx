import ExploreNecCarousel from "./ExploreNecCarousel";
import ExploreNecText from "./ExploreNecText";

function ExploreNec() {
  return (
    <section className="relative overflow-hidden border-y border-emerald-950/5 bg-[#f4faf7] py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-emerald-200/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ExploreNecText />
        <ExploreNecCarousel />
      </div>
    </section>
  );
}

export default ExploreNec;
