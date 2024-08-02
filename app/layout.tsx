import type { ReactNode } from "react";
import { StoreProvider } from "@/app/StoreProvider";
import { Inter } from "next/font/google";
import { ThemeWrapper } from "@/src/Components/Theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeWrapper>{children}</ThemeWrapper>
        </body>
      </html>
    </StoreProvider>
  );
}
