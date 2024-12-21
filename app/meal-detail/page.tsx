"use client";

import Meal from "@/components/meal";
import { useMealDetailContext } from "@/lib/meal-detail-context";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function MealPage() {
  const { meal } = useMealDetailContext();
  return (
    <ProtectedRoute>
      <Meal meal={meal} />
    </ProtectedRoute>
  );
}
