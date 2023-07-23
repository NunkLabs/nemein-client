import "./globals.css";

import { ThemeProvider } from "./theme";
import { Toaster } from "components/ui/Toaster";

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
