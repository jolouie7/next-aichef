"use server";

import bcrypt from "bcrypt";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signup(values: z.infer<typeof signupSchema>) {
  const validatedFields = signupSchema.safeParse({
    email: values.email,
    password: values.password,
  });

  if (!validatedFields.success) {
    return {
      error:
        "Invalid fields. Email must be valid and password must be at least 8 characters.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: "User with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      error: "Something went wrong during sign up. Please try again.",
    };
  }
}
