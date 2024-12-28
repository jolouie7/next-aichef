import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import ClientLayout from "@/app/client-layout";
import { Toaster } from "@/components/ui/toaster";
import { MealDetailProvider } from "@/lib/meal-detail-context";
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
        <ClientLayout>
          <MealsProvider>
            <MealDetailProvider>{children}</MealDetailProvider>
          </MealsProvider>
          <Toaster />
        </ClientLayout>
      </body>
    </html>
  );
}
