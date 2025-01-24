"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import Meal from "@/components/meal";
import MealCreationLoader from "@/components/meal-creation-loader";
import { useMealDetailContext } from "@/lib/meal-detail-context";

export default function MealPage() {
  const { meal, isLoading } = useMealDetailContext();

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
