import { StoreProvider } from "@/app/StoreProvider";
import { ThemeRegistry } from "@/src/theme/ThemeRegistry";
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
          <ThemeRegistry>{children}</ThemeRegistry>
        </body>
      </html>
    </StoreProvider>
  );
}
