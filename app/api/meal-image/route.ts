import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await generateImage({
    model: openai.image("dall-e-2"),
    prompt: `Professional food photography of ${prompt}, on a beautiful plate, restaurant style presentation, soft lighting`,
    size: "256x256",
  });

  const { image } = result;

  return Response.json({
    mealPicture: `data:image/png;base64,${image.base64}`,
  });
}
