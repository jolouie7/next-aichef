"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import Meal from "@/components/meal";
import MealCreationLoader from "@/components/meal-creation-loader";
import { toast } from "@/hooks/use-toast";
import { useMealDetailContext } from "@/lib/meal-detail-context";
import { createMeal } from "@/server/actions/meal";

export default function MealPage() {
  const { meal, isLoading, setMeal } = useMealDetailContext();
  const [mealSaved, setMealSaved] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) {
    toast({
      title: "Error",
      description: "You must be logged in to save meals",
      variant: "destructive",
    });
    return;
  }

  // Fetch the meal image
  useEffect(() => {
    const fetchMealImage = async () => {
      if (meal.title && meal.description && !meal.mealPicture) {
        try {
          const mealImageResponse = await fetch("/api/meal-image", {
            method: "POST",
            body: JSON.stringify({
              prompt: `Generate a meal image for title: ${meal.title} and description: ${meal.description}.`,
            }),
          });

          const mealImageData = await mealImageResponse.json();
          setMeal({ ...meal, mealPicture: mealImageData.mealPicture });
        } catch (error) {
          console.error("Error fetching meal image:", error);
          toast({
            title: "Error",
            description: "Failed to fetch meal image",
            variant: "destructive",
          });
        }
      }
    };
    fetchMealImage();
  }, [meal?.title, meal?.description]);

  // Save the meal to the database
  useEffect(() => {
    const saveMeal = async () => {
      if (
        meal?.mealPicture &&
        meal?.title &&
        meal?.description &&
        userId &&
        !mealSaved
      ) {
        try {
          await createMeal({
            name: meal.title,
            description: meal.description,
            mealPicture: meal.mealPicture,
            userId: userId.replace(/"/g, ""), // Do this to remove extra quotes
            ingredients: meal.ingredients,
            instructions: meal.instructions,
          });
          setMealSaved(true);
        } catch (error) {
          console.error("Error saving meal:", error);
          toast({
            title: "Error",
            description: "Failed to save meal",
            variant: "destructive",
          });
        }
      }
    };
    saveMeal();
  }, [meal?.mealPicture, mealSaved, userId]);

  if (isLoading || !meal) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <MealCreationLoader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Meal meal={meal} />
    </ProtectedRoute>
  );
}
