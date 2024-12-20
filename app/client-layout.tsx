"use client";

import { SessionProvider } from "next-auth/react";
import { MealsProvider } from "@/lib/meals-context";
import { MealDetailProvider } from "@/lib/meal-detail-context";
import { MainNav } from "@/components/main-nav";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <MealsProvider>
        <MealDetailProvider>
          <MainNav />
          {children}
        </MealDetailProvider>
      </MealsProvider>
    </SessionProvider>
  );
};

export default ClientLayout;
