"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./ui/button";

import { updateMeal } from "@/app/actions/meal";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface UpdateMealFormProps {
  mealId: string;
  userId: string;
  initialData: {
    name: string;
    description: string;
    mealPicture: string;
    ingredients: { id: string; name: string }[];
    instructions: { id: string; description: string }[];
  };
}

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  mealPicture: z.string(),
  ingredients: z.array(z.object({ id: z.string(), name: z.string() })),
  instructions: z.array(z.object({ id: z.string(), description: z.string() })),
});

export default function UpdateMealForm({
  mealId,
  userId,
  initialData,
}: UpdateMealFormProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [mealPicture, setMealPicture] = useState(initialData.mealPicture);
  const [ingredients, setIngredients] = useState(initialData.ingredients);
  const [instructions, setInstructions] = useState(initialData.instructions);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      mealPicture: initialData.mealPicture,
      ingredients: initialData.ingredients,
      instructions: initialData.instructions,
    },
  });

  const onIngredientsChange = (ingredients: { id: string; name: string }[]) => {
    setIngredients(ingredients);
    form.setValue("ingredients", ingredients);
  };

  const onInstructionsChange = (
    instructions: {
      id: string;
      description: string;
    }[],
  ) => {
    setInstructions(instructions);
    form.setValue("instructions", instructions);
  };

  const handleDeleteIngredient = async (id: string) => {
    try {
      const updatedIngredients = ingredients.filter(
        (ingredient) => ingredient.id !== id,
      );
      setIngredients(updatedIngredients);
      form.setValue("ingredients", updatedIngredients);

      toast({
        title: "Success",
        description: "Ingredient deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      toast({
        title: "Error",
        description: "Failed to delete ingredient",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInstruction = async (id: string) => {
    try {
      const updatedInstructions = instructions.filter(
        (instruction) => instruction.id !== id,
      );
      setInstructions(updatedInstructions);
      form.setValue("instructions", updatedInstructions);

      toast({
        title: "Success",
        description: "Instruction deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting instruction:", error);
      toast({
        title: "Error",
        description: "Failed to delete instruction",
        variant: "destructive",
      });
    }
  };

  const handleAddIngredient = () => {
    const newIngredient = { id: "", name: "" };
    const updatedIngredients = [...ingredients, newIngredient];
    setIngredients(updatedIngredients);
    form.setValue("ingredients", updatedIngredients);
  };

  const handleAddInstruction = () => {
    const newInstruction = { id: "", description: "" };
    const updatedInstructions = [...instructions, newInstruction];
    setInstructions(updatedInstructions);
    form.setValue("instructions", updatedInstructions);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await updateMeal(mealId, {
        name,
        description,
        mealPicture,
        userId,
        ingredients,
        instructions,
      });

      if (!response.success) {
        toast({
          title: "Error",
          description: response.error || "Failed to update meal",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Meal updated successfully",
      });

      router.refresh();
      router.push(`/my-meals`);
    } catch (error) {
      console.error("Error updating meal:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Name:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Description:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mealPicture"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Meal Picture URL:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={mealPicture}
                  onChange={(e) => setMealPicture(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ingredients:</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value.map(
                    (
                      ingredient: { id: string; name: string },
                      index: number,
                    ) => (
                      <div
                        key={ingredient.id}
                        className="flex items-center gap-2"
                      >
                        <Input
                          value={ingredient.name}
                          onChange={(e) => {
                            const newIngredients = [...field.value];
                            newIngredients[index] = {
                              id: newIngredients[index].id,
                              name: e.target.value,
                            };
                            onIngredientsChange(newIngredients);
                          }}
                          placeholder={`Ingredient ${index + 1}`}
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="hover:text-destructive"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure you want to delete this
                                ingredient?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your ingredient.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteIngredient(ingredient.id)
                                }
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ),
                  )}
                </div>
              </FormControl>
              <Button
                type="button"
                variant="default"
                onClick={handleAddIngredient}
                className="mt-2 bg-green-500 hover:bg-green-600"
              >
                Add Ingredient
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Instructions:</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value.map(
                    (
                      instruction: { id: string; description: string },
                      index: number,
                    ) => (
                      <div
                        key={instruction.id}
                        className="flex items-center gap-2"
                      >
                        <Input
                          value={instruction.description}
                          onChange={(e) => {
                            const newInstructions = [...field.value];
                            newInstructions[index] = {
                              id: instruction.id,
                              description: e.target.value,
                            };
                            onInstructionsChange(newInstructions);
                          }}
                          placeholder={`Instruction ${index + 1}`}
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="hover:text-destructive"
                              size="icon"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure you want to delete this
                                instruction?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your instruction.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteInstruction(instruction.id)
                                }
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ),
                  )}
                </div>
              </FormControl>
              <Button
                type="button"
                variant="default"
                onClick={handleAddInstruction}
                className="mt-2 bg-green-500 hover:bg-green-600"
              >
                Add Instruction
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Meal"
          )}
        </Button>
      </form>
    </Form>
  );
}
