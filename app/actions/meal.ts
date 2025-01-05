"use server";

import { prisma } from "@/lib/prisma";

interface MealData {
  name: string;
  description: string;
  mealPicture: string;
  userId: string;
  ingredients: { id: string; name: string }[];
  instructions: { id: string; description: string }[];
}

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
                name: ingredient.name,
              },
            },
          })),
        },
        instructions: {
          create: meal.instructions.map((instruction) => ({
            totalSteps: meal.instructions.length,
            description: instruction.description,
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

export async function updateMeal(id: string, meal: MealData) {
  try {
    await prisma.mealIngredient.deleteMany({
      where: { mealId: id },
    });
    await prisma.instruction.deleteMany({
      where: { mealId: id },
    });

    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: {
        name: meal.name,
        description: meal.description,
        mealPicture: meal.mealPicture,
        ingredients: {
          create: meal.ingredients.map((ingredient) => ({
            ingredient: {
              connectOrCreate: {
                where: { id: ingredient.id },
                create: { name: ingredient.name },
              },
            },
          })),
        },
        instructions: {
          create: meal.instructions.map((instruction) => ({
            totalSteps: meal.instructions.length,
            description: instruction.description,
          })),
        },
      },
    });

    console.log("updatedMeal in updateMeal:", updatedMeal);
    return { success: true, meal: updatedMeal };
  } catch (error) {
    console.error("Error updating meal:", error);
    return { success: false, error: "Failed to update meal" };
  }
}

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

export async function deleteIngredient(id: string) {
  try {
    // Delete all MealIngredient records that reference this ingredient
    await prisma.mealIngredient.deleteMany({
      where: {
        ingredientId: id,
      },
    });

    const deletedIngredient = await prisma.ingredient.delete({
      where: { id },
    });

    return { success: true, deletedIngredient };
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    return { success: false, error: "Failed to delete ingredient" };
  }
}

export async function deleteInstruction(id: string) {
  try {
    const deletedInstruction = await prisma.instruction.delete({
      where: { id },
    });
    return { success: true, deletedInstruction };
  } catch (error) {
    console.error("Error deleting instruction:", error);
    return { success: false, error: "Failed to delete instruction" };
  }
}
