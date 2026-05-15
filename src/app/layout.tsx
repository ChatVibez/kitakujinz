import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gacha Machine - Spin & Win!",
  description: "Mesin gacha online - Beli token dan putar untuk memenangkan item langka!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          async
        />
      </head>
      <body className="antialiased bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
