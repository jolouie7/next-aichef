"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import Meal from "@/components/meal";
import { useMealDetailContext } from "@/lib/meal-detail-context";

export default function MealPage() {
  const { meal } = useMealDetailContext();
  return (
    <ProtectedRoute>
      <Meal meal={meal} />
    </ProtectedRoute>
  );
}
