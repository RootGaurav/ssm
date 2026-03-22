import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google"

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
})
export const metadata: Metadata = {
  title: "Society Subscription System",
  description: "Next.js frontend with Auth0 authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
 src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
 async
></script>
      </head>
      <body className={`${dmSans.variable} ${playfair.variable} font-sans`}>{children}</body>
    </html>
  );
}
