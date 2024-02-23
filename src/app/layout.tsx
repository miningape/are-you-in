import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";
import { NextUIClientProvider } from "./NextUIClientProvider";

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
        </NextUIClientProvider>
      </body>
    </html>
  );
}
