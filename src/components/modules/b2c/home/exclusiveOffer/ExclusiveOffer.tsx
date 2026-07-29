import DealsCarouselSection from "./DealsCarouselSection";

export default function ExclusiveOffer() {
  return (
    <section className="mt-20 max-w-[1600px] mx-auto ">
      <h1 className="text-6xl font-bold text-center">
        <span className="text-primary">Exclusive</span>{" "}
        <span className="text-red-600">Offer</span>
      </h1>

      <DealsCarouselSection />
    </section>
  );
}
