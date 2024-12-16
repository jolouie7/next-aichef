"use client";

import MealOption from "@/components/meal-option";
import { useMealsContext } from "@/lib/meals-context";
import { Suspense, useState } from "react";

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
  // imageUrl: string;
  ingredients: string[];
  instructions: string[];
}

export default function MealResultsPage() {
  const { meals } = useMealsContext();

  console.log("In MealResultsPage:", meals);

  const handleClick = ({
    title,
    description,
    ingredients,
    instructions,
  }: MealResult) => {
    console.log({ title, description, ingredients, instructions });
  };

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
                ingredients={meal.ingredients}
                instructions={meal.instructions}
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
