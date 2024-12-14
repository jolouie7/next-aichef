"use client";

import MealOption from "@/components/meal-option";

const meals = [
  {
    title: "Grilled Salmon with Asparagus",
    description:
      "Tender salmon fillet served with crisp asparagus spears and lemon butter sauce.",
  },
  {
    title: "Vegetarian Stir-Fry",
    description:
      "A colorful medley of fresh vegetables stir-fried in a savory garlic-ginger sauce.",
  },
  {
    title: "Chicken Fajita Bowl",
    description:
      "Spicy grilled chicken strips with bell peppers and onions, served over cilantro-lime rice.",
  },
  {
    title: "Mediterranean Quinoa Salad",
    description:
      "Protein-packed quinoa tossed with cucumber, tomatoes, feta, and a zesty lemon dressing.",
  },
  {
    title: "Beef and Mushroom Stroganoff",
    description:
      "Tender beef strips and mushrooms in a creamy sauce, served over egg noodles.",
  },
];

export default function MealResultsPage() {
  const handleClick = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    console.log({ title, description });
  };
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Pick a Meal</h1>
      <div className="flex flex-col gap-4">
        {meals.map((meal, idx) => (
          <div key={idx} className="w-full">
            <MealOption
              title={meal.title}
              description={meal.description}
              handleClick={handleClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
