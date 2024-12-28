"use client";

import Image from "next/image";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MealResult {
  title: string;
  description: string;
  mealPicture: string;
  ingredients: string[];
  instructions: string[];
}

interface MealResultProps {
  meal: MealResult;
}

export default function Meal({ meal }: MealResultProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="meal-result">
        <div className="flex justify-end mb-4 sm:mb-0 mt-4 mr-4">
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print Recipe
          </Button>
        </div>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">
            {meal.title}
          </CardTitle>
          <p className="text-lg">{meal.description}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 overflow-hidden rounded-lg max-w-md mx-auto">
            <Image
              src={meal.mealPicture}
              alt={meal.title}
              width={400}
              height={300}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
              <ul className="list-disc pl-5 space-y-2">
                {meal.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
              <ul className="list-disc pl-5 space-y-2">
                {meal.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
