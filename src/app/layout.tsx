import type { Metadata } from "next";
import { Poppins, Stalemate } from "next/font/google";
import "./globals.css";
import AppLoaderProvider from "@/provider/AppLoaderProvider";
import { StoreProvider } from "@/redux/StoreProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const stalemate = Stalemate({
  variable: "--font-stalemate",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "NEC TRAVELS OTA",
  description: "Nec Travels Online Travel Agency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${stalemate.variable} h-full antialiased`}>
      <body suppressHydrationWarning>
        <StoreProvider>
          <AppLoaderProvider>{children}</AppLoaderProvider>
        </StoreProvider>
        {/* <AppLoaderProvider>
          <StoreProvider>{children}</StoreProvider>
        </AppLoaderProvider> */}
        {/* {children} */}
        {/* <StoreProvider>{children}</StoreProvider> */}
      </body>
    </html>
  );
}
