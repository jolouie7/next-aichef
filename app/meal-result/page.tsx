"use client";

import MealCreationLoader from "@/components/meal-creation-loader";
import { useState } from "react";
import Meal from "@/components/meal";

const meal = {
  title: "Spicy Quinoa Bowl",
  description:
    "A nutritious and flavorful quinoa bowl packed with vegetables and a zesty dressing.",
  imageUrl: "/aichef-logo.png",
  ingredients: [
    "1 cup quinoa",
    "2 cups vegetable broth",
    "1 can black beans, drained and rinsed",
    "1 red bell pepper, diced",
    "1 cup corn kernels",
    "1/4 cup red onion, finely chopped",
    "1 avocado, sliced",
    "2 tablespoons olive oil",
    "1 lime, juiced",
    "1 teaspoon cumin",
    "1/2 teaspoon chili powder",
    "Salt and pepper to taste",
    "Fresh cilantro for garnish",
  ],
  instructions: [
    "Rinse quinoa and cook it in vegetable broth according to package instructions.",
    "While quinoa is cooking, prepare the vegetables.",
    "In a small bowl, whisk together olive oil, lime juice, cumin, chili powder, salt, and pepper to make the dressing. In a small bowl, whisk together olive oil, lime juice, cumin, chili powder, salt, and pepper to make the dressing.",
    "Once quinoa is cooked, fluff it with a fork and let it cool slightly.",
    "In a large bowl, combine the cooked quinoa, black beans, bell pepper, corn, and red onion.",
    "Pour the dressing over the quinoa mixture and toss to combine.",
    "Serve the quinoa bowl topped with sliced avocado and garnished with fresh cilantro.",
    "Rinse quinoa and cook it in vegetable broth according to package instructions.",
    "While quinoa is cooking, prepare the vegetables.",
    "In a small bowl, whisk together olive oil, lime juice, cumin, chili powder, salt, and pepper to make the dressing. In a small bowl, whisk together olive oil, lime juice, cumin, chili powder, salt, and pepper to make the dressing.",
    "Once quinoa is cooked, fluff it with a fork and let it cool slightly.",
    "In a large bowl, combine the cooked quinoa, black beans, bell pepper, corn, and red onion.",
    "Pour the dressing over the quinoa mixture and toss to combine.",
    "Serve the quinoa bowl topped with sliced avocado and garnished with fresh cilantro.",
  ],
};

export default function MealResult() {
  const [isLoading, setLoading] = useState(false);
  return (
    <div>
      {isLoading ? (
        <MealCreationLoader />
      ) : (
        <>
          <Meal meal={meal} />
        </>
      )}
    </div>
  );
}
