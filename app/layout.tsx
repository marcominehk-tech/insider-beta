import type { Metadata } from "next";
import AuthSessionProvider from "@/components/session-provider";
import Navbar from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Insider Beta",
  description: "會員訂閱網站示範專案",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-black text-white">
        <AuthSessionProvider>
          <Navbar />
          <div className="min-h-[calc(100vh-57px)]">{children}</div>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

