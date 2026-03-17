import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Society Portal",
  description: "Sign in to the Society Subscription System",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
