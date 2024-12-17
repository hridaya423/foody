import type { Metadata } from "next";
import "./globals.css";
// qoks

export const metadata: Metadata = {
  title: "Foody",
  description: "Your web kitchen buddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
