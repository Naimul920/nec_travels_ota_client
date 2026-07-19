import Image from "next/image";

const Loader = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary relative overflow-hidden">
      <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl animate-ping"></div>
      <div className="absolute w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>

      <div className="relative">
        <div className="w-20 h-20 border-4 border-white border-t-secondary rounded-full animate-spin"></div>

        <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
      </div>

      <div className="flex flex-col justify-center items-center mt-5">
        <p className="text-xs font-semibold">YOUR TRAVEL BE SAFER</p>
        <Image
          src="/assets/images/with.png"
          alt="Logo"
          className="mx-auto w-9"
          width={200}
          height={200}
          draggable={false}
        />
        <h1 className="font-extrabold text-3xl -mt-2.5 text-shadow-2xs">
          <span className="text-white">NEC</span>{" "}
          <span className="text-secondary">TRAVELS</span>
        </h1>
      </div>
    </div>
  );
};

export default Loader;
