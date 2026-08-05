import AppLoaderProvider from "@/providers/AppLoaderProvider";
import QueryProviders from "@/providers/QueryProvider";
import { Inter, Space_Grotesk, IBM_Plex_Mono, Stalemate } from "next/font/google";
import AuthProvider from "@/providers/AuthProvider";
import CurrencyProvider from "@/providers/CurrencyProvider";
import { App as AntdApp } from "antd";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasAuth = Boolean(cookieStore.get("access_token")?.value);

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${stalemate.variable} h-full antialiased  font-plex-mono`}
    >
      <body suppressHydrationWarning>
        <QueryProviders>
          <AuthProvider hasAuth={hasAuth}>
            <CurrencyProvider>
              <AntdApp>
                <AppLoaderProvider>{children}</AppLoaderProvider>
              </AntdApp>
            </CurrencyProvider>
          </AuthProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
