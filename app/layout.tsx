import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MainNav } from "@/components/main-nav";
import { MealsProvider } from "@/lib/meals-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chef",
  description: "Generate any Meal with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MealsProvider>
          <MainNav />
          {children}
        </MealsProvider>
        <Toaster />
      </body>
    </html>
  );
}
