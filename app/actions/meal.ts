"use server";

import { prisma } from "@/lib/prisma";

interface MealData {
  name: string;
  description: string;
  mealPicture: string;
  userId: string;
  ingredients: string[];
  instructions: string[];
}

// Add meal to db
export async function createMeal(meal: MealData) {
  console.log("meal in createMeal:", meal);
  try {
    const newMeal = await prisma.meal.create({
      data: {
        name: meal.name,
        description: meal.description,
        mealPicture: meal.mealPicture,
        userId: meal.userId,
        ingredients: {
          create: meal.ingredients.map((ingredient) => ({
            ingredient: {
              create: {
                name: ingredient,
              },
            },
          })),
        },
        instructions: {
          create: meal.instructions.map((instruction) => ({
            totalSteps: meal.instructions.length,
            description: instruction,
          })),
        },
      },
    });
    return { success: true, meal: newMeal };
  } catch (error) {
    console.error("Error creating meal:", error);
    return { success: false, error: "Failed to create meal" };
  }
}

// Get all meals from db
export async function getAllMeals() {
  try {
    const meals = await prisma.meal.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: true,
      },
    });
    return { success: true, meals };
  } catch (error) {
    console.error("Error fetching meals:", error);
    return { success: false, meals: [] };
  }
}

// Get meal details by id
export async function getMealById(id: string) {
  try {
    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: true,
      },
    });
    return { success: true, meal };
  } catch (error) {
    console.error("Error fetching meal:", error);
    return { success: false, meal: null };
  }
}

// Delete meal from db
export async function deleteMeal(id: string) {
  try {
    const deletedMeal = await prisma.meal.delete({
      where: { id },
    });
    return { success: true, deletedMeal };
  } catch (error) {
    console.error("Error deleting meal:", error);
    return { success: false, error: "Failed to delete meal" };
  }
}
