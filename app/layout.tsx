import "./globals.css";

import { Metadata } from "next";

import { ThemeProvider } from "./theme";
import { Toaster } from "components/ui/Toaster";

export const metadata: Metadata = {
  title: "nemein",
  description: "tetris meets rougelite",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head></head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
