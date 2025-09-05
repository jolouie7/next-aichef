import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    system:
      "You will generate a single recipe consisting of a title, description, ingredients, and instructions.",
    prompt,
    schema: z.object({
      title: z.string(),
      description: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
    }),
  });

  const mealData = result.object;

  return Response.json({
    ...mealData,
  });
}
