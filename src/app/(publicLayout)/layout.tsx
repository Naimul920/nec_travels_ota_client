// import Navbar from "@/components/public/Navbar";
// import Footer from "@/components/public/Footer";

// import Footer from "@/components/shared/Footer/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Navbar /> */}

      <main>{children}</main>

      {/* <Footer /> */}
    </>
  );
}