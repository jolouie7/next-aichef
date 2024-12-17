import {
  generateObject,
  experimental_generateImage as generateImage,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

// TODO? Can i add a option to add an image to the recipe

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const [result, imageResponse] = await Promise.all([
    generateObject({
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
    }),
    generateImage({
      model: openai.image("dall-e-2"),
      prompt: `Professional food photography of ${prompt}, on a beautiful plate, restaurant style presentation, soft lighting`,
      size: "512x512",
    }),
  ]);

  const recipeData = result.object;
  const { image } = imageResponse;
  console.log("here in meal detail route:", { recipeData, image });

  return Response.json({
    ...recipeData,
    imageUrl: `data:image/png;base64,${image.base64}`,
  });
}
