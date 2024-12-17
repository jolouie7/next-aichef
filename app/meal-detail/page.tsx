"use client";

import Meal from "@/components/meal";
import { useMealDetailContext } from "@/lib/meal-detail-context";

export default function MealPage() {
  const { meal } = useMealDetailContext();
  return (
    <>
      <Meal meal={meal} />
    </>
  );
}
