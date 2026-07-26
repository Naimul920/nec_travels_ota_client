import { Poppins, Stalemate } from "next/font/google";
import AppLoaderProvider from "@/providers/AppLoaderProvider";
import "./globals.css";

import Providers from "@/providers/providers";
import QueryProviders from "@/providers/QueryProvider";

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
    <html
      lang="en"
      className={`${poppins.variable} ${stalemate.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning>
        <QueryProviders>
          <Providers>
            <AppLoaderProvider>{children}</AppLoaderProvider>
          </Providers>
        </QueryProviders>
      </body>
    </html>
  );
}
