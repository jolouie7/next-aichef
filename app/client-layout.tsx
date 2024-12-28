"use client";

import { SessionProvider } from "next-auth/react";

import { MainNav } from "@/components/main-nav";
import { MealDetailProvider } from "@/lib/meal-detail-context";
import { MealsProvider } from "@/lib/meals-context";

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
