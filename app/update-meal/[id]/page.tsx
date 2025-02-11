import { redirect } from "next/navigation";

import UpdateMealForm from "@/components/update-meal-form";
import { getCurrentUser } from "@/lib/auth";
import { getMealById } from "@/server/actions/meal";

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
          ingredients: meal.ingredients.map((ingredient) => ({
            id: ingredient.ingredientId,
            name: ingredient.ingredient.name,
          })),
          instructions: meal.instructions.map((instruction) => ({
            id: instruction.id,
            description: instruction.description,
          })),
        }}
      />
    </div>
  );
}
