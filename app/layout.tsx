import { StoreProvider } from "@/app/StoreProvider";
import { ThemeWrapper } from "@/src/theme/ThemeProvider";
import { Inter } from "next/font/google";

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
