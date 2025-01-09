"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useSession } from "next-auth/react";

import { createMeal } from "../../server/actions/meal";

import { ProtectedRoute } from "@/components/auth/protected-route";
import MealCreationLoader from "@/components/meal-creation-loader";
import MealOption from "@/components/meal-option";
import { toast } from "@/hooks/use-toast";
import { useMealDetailContext } from "@/lib/meal-detail-context";
import { useMealsContext } from "@/lib/meals-context";

interface MealResult {
  title: string;
  description: string;
}

export default function MealResultsPage() {
  const [loading, setLoading] = useState(false);

  const { meals } = useMealsContext();
  const router = useRouter();
  const { setMeal } = useMealDetailContext();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleClick = async ({ title, description }: MealResult) => {
    try {
      setLoading(true);
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to save meals",
          variant: "destructive",
        });
        return;
      }

      const res = await fetch("/api/meal-detail", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Generate a meal with title: ${title} and description: ${description}.`,
        }),
      });
      const data = await res.json();

      setMeal(data);
      await createMeal({
        name: data.title,
        description: data.description,
        mealPicture: data.mealPicture,
        userId: userId.replace(/"/g, ""), // remove quotes from userId
        ingredients: data.ingredients,
        instructions: data.instructions,
      });

      router.push("/meal-detail");
    } catch (error) {
      console.error("Error creating meal:", error);
      toast({
        title: "Error",
        description: "Failed to save meal",
        variant: "destructive",
      });
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
