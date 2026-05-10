import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salary Command Center",
  description: "HR salary management dashboard"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
