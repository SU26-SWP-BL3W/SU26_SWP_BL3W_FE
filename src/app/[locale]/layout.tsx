import type { Metadata } from "next";
import { Chakra_Petch, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { AppLayoutWrapper } from "@/components/domain/AppLayoutWrapper";
import { QuickRoleSwitcherBar } from "@/components/domain/QuickRoleSwitcherBar";
import "@/styles/tokens.css";
import "../globals.css";

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "SEAL — Đấu Trường Hackathon Sinh Viên",
  description: "Hệ thống quản lý giải đấu Hackathon & Kết nối Talent SEAL",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${chakraPetch.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>
              <AppLayoutWrapper>{children}</AppLayoutWrapper>
              <QuickRoleSwitcherBar />
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
