import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MealsProvider } from "@/lib/meals-context";
import { MealDetailProvider } from "@/lib/meal-detail-context";
import ClientLayout from "@/app/client-layout";

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
          <MealDetailProvider>
            <ClientLayout>{children}</ClientLayout>
          </MealDetailProvider>
        </MealsProvider>
        <Toaster />
      </body>
    </html>
  );
}
