import { redirect } from "next/navigation";

import { getMealById } from "@/app/actions/meal";
import UpdateMealForm from "@/components/update-meal-form";
import { getCurrentUser } from "@/lib/auth";

export default async function UpdateMealPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/signin");
  }

  const { success, meal } = await getMealById(params.id);

  if (!success || !meal) {
    redirect("/my-meals");
  }

  // Check if user owns this meal
  if (meal.userId !== user.id) {
    redirect("/my-meals");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Update Meal</h1>
      <UpdateMealForm
        mealId={params.id}
        userId={user.id}
        initialData={{
          name: meal.name,
          description: meal.description,
          mealPicture: meal.mealPicture || "",
          ingredients: meal.ingredients.map((i) => i.ingredient.name),
          instructions: meal.instructions.map((i) => i.description),
        }}
      />
    </div>
  );
}
