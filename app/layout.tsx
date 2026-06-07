import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "./components/layoutwrapper";

export const metadata: Metadata = {
  title: "Likeloop Music",
  description: "Your favorite music player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-[#E99D72] via-[#9b5de5] to-[#00bbf9] overflow-hidden text-white font-sans h-screen w-screen">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}