import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    system:
      "You will generate 5 different recipes consisting of a title and description.",
    prompt,
    schema: z.object({
      meals: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
        })
      ),
    }),
  });

  const response = result.toJsonResponse();
  console.log(response);
  return response;
}
