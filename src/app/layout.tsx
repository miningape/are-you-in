import { Toaster } from "react-hot-toast";
import { NextUIClientProvider } from "./NextUIClientProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="text-default-900 bg-background">
      <body>
        <NextUIClientProvider>
          {children}
          <Toaster />
          <SpeedInsights />
        </NextUIClientProvider>
      </body>
    </html>
  );
}
