import DealsCarouselSection from "./DealsCarouselSection";

export default function ExclusiveOffer() {
  return (
    <section className="mx-auto mt-16 max-w-[1600px] md:mt-24">
      <h1 className="text-center text-4xl font-bold sm:text-5xl md:text-6xl">
        <span className="text-primary">Exclusive</span>{" "}
        <span className="text-red-600">Offer</span>
      </h1>

      <DealsCarouselSection />
    </section>
  );
}
