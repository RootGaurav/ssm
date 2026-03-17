import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}