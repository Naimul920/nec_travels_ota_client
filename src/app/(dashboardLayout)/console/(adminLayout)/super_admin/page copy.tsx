import HomeTabs from "../../../../../components/common/Home/HomeTabs";

export default function HomePage() {
  return (
    <>
      {/* <section className="mb-5 mt-3 flex flex-col items-center justify-center md:mt-0">
        <p className="text-xs font-semibold tracking-[0.3em] text-gray-800 md:text-2xl">
          YOUR TRAVEL BE SAFER
        </p>
        <span className="mt-2 font-stalemate text-6xl text-gray-900 sm:text-8xl md:text-9xl">
          With
        </span>
        <h1 className="-mt-4 text-3xl font-bold text-shadow-2xs md:text-8xl">
          <span className="text-primary">NEC</span>{" "}
          <span className="text-secondary">TRAVELS</span>
        </h1>
      </section> */}
      <HomeTabs />
    </>
  );
}
