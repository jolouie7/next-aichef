"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface Meal {
  title: string;
  description: string;
}

interface MealsContextType {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MealsContext = createContext<MealsContextType | null>(null);

export const MealsProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MealsContext.Provider value={{ meals, setMeals, isLoading, setIsLoading }}>
      {children}
    </MealsContext.Provider>
  );
};

export const useMealsContext = () => {
  const context = useContext(MealsContext);
  // Do a null check because I was getting an error saying setMeals could be null
  if (context === null) {
    throw new Error("There was an error getting the meals context");
  }
  return context;
};
