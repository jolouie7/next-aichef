"use client";

import MealOption from "@/components/meal-option";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMealsContext } from "@/lib/meals-context";
import { useMealDetailContext } from "@/lib/meal-detail-context";
import MealCreationLoader from "@/components/meal-creation-loader";

// const meals = [
//   {
//     title: "Grilled Salmon with Asparagus",
//     description:
//       "Tender salmon fillet served with crisp asparagus spears and lemon butter sauce.",
//   },
//   {
//     title: "Vegetarian Stir-Fry",
//     description:
//       "A colorful medley of fresh vegetables stir-fried in a savory garlic-ginger sauce.",
//   },
//   {
//     title: "Chicken Fajita Bowl",
//     description:
//       "Spicy grilled chicken strips with bell peppers and onions, served over cilantro-lime rice.",
//   },
//   {
//     title: "Mediterranean Quinoa Salad",
//     description:
//       "Protein-packed quinoa tossed with cucumber, tomatoes, feta, and a zesty lemon dressing.",
//   },
//   {
//     title: "Beef and Mushroom Stroganoff",
//     description:
//       "Tender beef strips and mushrooms in a creamy sauce, served over egg noodles.",
//   },
// ];

interface MealResult {
  title: string;
  description: string;
}

export default function MealResultsPage() {
  const [loading, setLoading] = useState(false);
  const { meals } = useMealsContext(); // get meals from context
  const router = useRouter();
  const { setMeal } = useMealDetailContext(); // set chosen meal in context

  console.log("In MealResultsPage:", meals);

  const handleClick = async ({ title, description }: MealResult) => {
    console.log({ title, description });

    try {
      setLoading(true);
      // make api request to generate meal
      const res = await fetch("/api/meal-detail", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Generate a recipe with the title: ${title} and description: ${description}.`,
        }),
      });
      // have loading screen while waiting for response
      // add res to meal context
      const data = await res.json();
      setMeal(data);

      // Navigate first
      await router.push("/meal-detail");

      // Then set loading to false after navigation
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
  );
}
