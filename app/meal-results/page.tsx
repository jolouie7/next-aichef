"use client";

import MealOption from "@/components/meal-option";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMealsContext } from "@/lib/meals-context";
import { useMealDetailContext } from "@/lib/meal-detail-context";
import MealCreationLoader from "@/components/meal-creation-loader";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface MealResult {
  title: string;
  description: string;
}

export default function MealResultsPage() {
  const [loading, setLoading] = useState(false);
  const { meals } = useMealsContext(); // get meals from context
  const router = useRouter();
  const { setMeal } = useMealDetailContext(); // set chosen meal in context

  const handleClick = async ({ title, description }: MealResult) => {
    try {
      setLoading(true);
      // make api request to generate meal
      const res = await fetch("/api/meal-detail", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Generate a meal with title: ${title} and description: ${description}.`,
        }),
      });
      const data = await res.json();

      setMeal(data);

      // Use replace instead of push to prevent adding to history
      // This should prevent the flash of content
      router.replace("/meal-detail");

      setLoading(false);
    } catch (error) {
      console.error("Error generating meal:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <MealCreationLoader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Pick a Meal</h1>
        <div className="flex flex-col gap-4">
          {meals.length > 0 ? (
            meals.map((meal: MealResult, idx: number) => (
              <div key={idx} className="w-full">
                <MealOption
                  title={meal.title}
                  description={meal.description}
                  handleClick={handleClick}
                />
              </div>
            ))
          ) : (
            <p>No meals available. Please create a meal first.</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
