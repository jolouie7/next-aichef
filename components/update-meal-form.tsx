"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./ui/button";

import { updateMeal } from "@/app/actions/meal";
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
    ingredients: string[];
    instructions: string[];
  };
}

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  mealPicture: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
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

  const onIngredientsChange = (ingredients: string[]) => {
    setIngredients(ingredients);
    form.setValue("ingredients", ingredients);
  };

  const onInstructionsChange = (instructions: string[]) => {
    setInstructions(instructions);
    form.setValue("instructions", instructions);
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

      if (response.success) {
        toast({
          title: "Success",
          description: "Meal updated successfully",
        });
        router.push("/my-meals");
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update meal",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
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
                  {field.value.map((ingredient: string, index: number) => (
                    <Input
                      key={index}
                      value={ingredient}
                      onChange={(e) => {
                        const newIngredients = [...field.value];
                        newIngredients[index] = e.target.value;
                        onIngredientsChange(newIngredients);
                      }}
                      placeholder={`Ingredient ${index + 1}`}
                    />
                  ))}
                </div>
              </FormControl>
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
                  {field.value.map((instruction: string, index: number) => (
                    <Input
                      key={index}
                      value={instruction}
                      onChange={(e) => {
                        const newInstructions = [...field.value];
                        newInstructions[index] = e.target.value;
                        onInstructionsChange(newInstructions);
                      }}
                      placeholder={`Instruction ${index + 1}`}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
