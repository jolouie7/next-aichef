"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Meal {
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
}

interface MealDetailContextType {
  meal: Meal;
  setMeal: React.Dispatch<React.SetStateAction<Meal>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MealDetailContext = createContext<MealDetailContextType | null>(null);

export const MealDetailProvider = ({ children }: { children: ReactNode }) => {
  const [meal, setMeal] = useState<Meal>({
    title: "",
    description: "",
    imageUrl: "",
    ingredients: [],
    instructions: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MealDetailContext.Provider
      value={{ meal, setMeal, isLoading, setIsLoading }}
    >
      {children}
    </MealDetailContext.Provider>
  );
};

export const useMealDetailContext = () => {
  const context = useContext(MealDetailContext);
  // Do a null check because I was getting an error saying setMeals could be null
  if (context === null) {
    throw new Error("There was an error getting the meal detail context");
  }
  return context;
};
