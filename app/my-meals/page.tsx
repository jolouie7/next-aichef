"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { getAllMeals } from "../actions/meal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

//TODO: figure out a way to cache meals and only update when user adds or deletes a meal

interface Meal {
  id: string;
  name: string;
  description: string;
  mealPicture: string | null;
}

export default function MyMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      const meals = await getAllMeals();
      if (meals.success) {
        setMeals(meals.meals);
      }
      setIsLoading(false);
    };
    fetchMeals();
  }, []);

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Meals</h1>
        {isLoading ? (
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[300px] w-[250px]" />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {meals.map((meal) => (
              <Card
                key={meal.id}
                className="flex-1 min-w-[250px] max-w-[300px]"
              >
                <CardHeader>
                  <CardTitle>{meal.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {meal.mealPicture && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <AspectRatio ratio={4 / 3}>
                        <Image
                          src={meal.mealPicture}
                          alt={meal.name}
                          fill
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                  )}
                  <p className="line-clamp-3">{meal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div>No meals found</div>
        )}
      </div>
    </ProtectedRoute>
  );
}
