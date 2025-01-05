"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import { deleteMeal, getAllMeals } from "../actions/meal";

import { ProtectedRoute } from "@/components/auth/protected-route";
import Meal from "@/components/meal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

//TODO: break off the meal card into its own component
//TODO: add pagination

interface MealData {
  id: string;
  name: string;
  description: string;
  mealPicture: string | null;
  ingredients: { ingredient: { name: string } }[];
  instructions: { description: string }[];
}

export default function MyMealsPage() {
  const [meals, setMeals] = useState<MealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const handleDeleteMeal = async (mealId: string) => {
    const response = await deleteMeal(mealId);
    if (response.success) {
      setMeals(meals.filter((meal) => meal.id !== mealId));
    }
    console.log("deleting meal with mealId:", mealId);
  };

  const handleEditMeal = async (mealId: string) => {
    router.push(`/update-meal/${mealId}`);
    console.log("editing meal with mealId:", mealId);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">My Meals</h1>
        {isLoading ? (
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-[250px]" />
            ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {meals.map((meal: MealData) => (
              <Card
                key={meal.id}
                className="flex-1 min-w-[250px] max-w-[300px]"
              >
                <div className="flex justify-end gap-2 p-4 pb-0">
                  <Button
                    variant="outline"
                    className="hover:text-blue-500"
                    onClick={() => handleEditMeal(meal.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure you want to delete this meal?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your meal.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMeal(meal.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Dialog>
                  <DialogTrigger className="cursor-pointer" asChild>
                    <div>
                      <CardHeader>
                        <CardTitle className="text-xl line-clamp-2">
                          {meal.name}
                        </CardTitle>
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
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[800px] w-[90vw]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        {meal.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <Meal
                        meal={{
                          title: meal.name,
                          description: meal.description,
                          mealPicture: meal.mealPicture || "",
                          ingredients: meal.ingredients.map(
                            (i) => i.ingredient.name,
                          ),
                          instructions: meal.instructions.map(
                            (i) => i.description,
                          ),
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
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
