import { Poppins, Stalemate } from "next/font/google";
import AppLoaderProvider from "@/providers/AppLoaderProvider";
import "./globals.css";

import Providers from "@/providers/AuthProvider";
import QueryProviders from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";

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
          <AuthProvider>
            <AppLoaderProvider>{children}</AppLoaderProvider>
          </AuthProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
