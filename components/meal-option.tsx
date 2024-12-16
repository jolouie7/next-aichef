// "use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MealOptionProps {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  handleClick: ({
    title,
    description,
    ingredients,
    instructions,
  }: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
  }) => void;
}

export default function MealOption({
  title,
  description,
  ingredients,
  instructions,
  handleClick,
}: MealOptionProps) {
  return (
    <>
      <Card
        className="hover:cursor-pointer hover:bg-accent"
        onClick={() =>
          handleClick({ title, description, ingredients, instructions })
        }
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </>
  );
}
