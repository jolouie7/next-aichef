"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

interface BaseMealData {
  name: string;
  description: string;
  mealPicture: string;
  userId: string;
}

interface CreateMealData extends BaseMealData {
  ingredients: string[];
  instructions: string[];
}

interface UpdateMealData extends BaseMealData {
  ingredients: { id: string; name: string }[];
  instructions: { id: string; description: string }[];
}

export async function createMeal(meal: CreateMealData) {
  try {
    const newMeal = await prisma.meal.create({
      data: {
        name: meal.name,
        description: meal.description,
        mealPicture: meal.mealPicture,
        userId: meal.userId,
        ingredients: {
          create: meal.ingredients.map((ingredientName) => ({
            ingredient: {
              connectOrCreate: {
                where: { name: ingredientName },
                create: { name: ingredientName },
              },
            },
          })),
        },
        instructions: {
          create: meal.instructions.map((instructionText) => ({
            totalSteps: meal.instructions.length,
            description: instructionText,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: true,
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
    revalidatePath("/my-meals");
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

    if (!meal) {
      return { success: false, error: "Meal not found" };
    }

    revalidatePath(`/update-meal/${id}`);
    return { success: true, meal };
  } catch (error) {
    console.error("Error getting meal:", error);
    return { success: false, error: "Failed to get meal" };
  }
}

export async function getCurrentUserMeals(userId: string) {
  try {
    if (!userId) {
      console.error("No user ID provided");
      return { success: false, meals: [], error: "No user ID provided" };
    }

    const meals = await prisma.meal.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: true,
      },
    });

    if (!meals) {
      console.error("No meals found for user");
      return { success: false, meals: [], error: "No meals found" };
    }

    revalidatePath("/my-meals");
    return { success: true, meals };
  } catch (error) {
    console.error("Error fetching meals:", error);
    return { success: false, meals: [], error: "Failed to fetch meals" };
  }
}

export async function updateMeal(id: string, meal: UpdateMealData) {
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
                where: { name: ingredient.name },
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
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: true,
      },
    });

    return { success: true, meal: updatedMeal };
  } catch (error) {
    console.error("Error updating meal:", error);
    return { success: false, error: "Failed to update meal" };
  }
}

export async function deleteMeal(id: string) {
  try {
    const deletedMeal = await prisma.$transaction(async (tx) => {
      const mealIngredients = await tx.mealIngredient.findMany({
        // Get all ingredient IDs used by this meal
        where: { mealId: id },
        select: { ingredientId: true },
      });
      const ingredientIds = mealIngredients.map(
        (mealIngredient) => mealIngredient.ingredientId,
      );

      // Delete the meal
      const meal = await tx.meal.delete({
        where: { id },
      });

      // Check for orphaned ingredients and delete them
      for (const ingredientId of ingredientIds) {
        const count = await tx.mealIngredient.count({
          where: { ingredientId },
        });

        if (count === 0) {
          await tx.ingredient.delete({
            where: { id: ingredientId },
          });
        }
      }
      return meal;
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
