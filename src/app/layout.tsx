import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EquipRent",
  description: "Borrow the gear you need, by the day",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <NextAuthProvider session={session}>
          <TopMenu />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
