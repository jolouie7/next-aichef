"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Combobox } from "./combobox";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useMealsContext } from "@/lib/meals-context";

const formSchema = z.object({
  mealtime: z.string(),
  ingredient: z.string(),
});

export default function CreateMealForm() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { setMeals } = useMealsContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mealtime: "",
      ingredient: "",
    },
  });

  const onAddIngredient = (ingredient: string) => {
    const trimmedIngredient = ingredient.trim();
    if (trimmedIngredient) {
      setIngredients([...ingredients, trimmedIngredient]);
      form.resetField("ingredient");
    }
  };

  const onClearIngredients = () => {
    setIngredients([]);
  };

  const onDeleteIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const onSubmit = async () => {
    // Theres no ingredients added or no mealtime selected
    if (ingredients.length === 0 || !form.getValues("mealtime")) {
      toast({
        title: "Error",
        description: "Please select a mealtime and add at least one ingredient",
        variant: "destructive",
      });
      return;
    }
    console.log(ingredients);

    try {
      setIsLoading(true);
      const res = await fetch("/api/meal-results", {
        method: "POST",
        body: JSON.stringify({
          prompt: `Generate recipes for ${form.getValues("mealtime")} with ${ingredients.join(
            ", ",
          )} ingredients.`,
        }),
      });
      const data = await res.json();
      console.log("In create meal form:", data);
      setMeals(data.meals);
      router.push("/meal-results");
    } catch (error) {
      console.error("Error generating meals:", error);
      toast({
        title: "Error",
        description: "Failed to generate meals. Please try again.",
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
          name="mealtime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Meal Time:</FormLabel>
              <FormControl>
                <Combobox value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ingredient"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ingredient:</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add Ingredient"
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddIngredient(form.getValues("ingredient"));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => onAddIngredient(form.getValues("ingredient"))}
            variant={"outline"}
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            type="button"
          >
            Add
          </Button>
          <Button
            onClick={onClearIngredients}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            type="button"
          >
            Clear
          </Button>
        </div>
        <div>
          <h3>Ingredients</h3>
          <Separator className="my-4" />
          <Table>
            <TableBody>
              {ingredients.map((ingredient, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{ingredient}</TableCell>
                  <TableCell className="flex justify-end">
                    <Trash2
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        onDeleteIngredient(ingredient);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating meals...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
