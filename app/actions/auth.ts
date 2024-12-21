"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function signup(formData: FormData) {
  const validatedFields = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error:
        "Invalid fields. Email must be valid and password must be at least 8 characters.",
    };
  }

  const { email, password } = validatedFields.data;

  console.log("in auth server action:", email, password);

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: "User with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
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

export async function signin(formData: FormData) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: formData.get("email") as string },
    });

    const isPasswordValid = await bcrypt.compare(
      formData.get("password") as string,
      user?.password || ""
    );

    if (!user || !isPasswordValid) {
      return {
        error: "Invalid credentials. Please check your email and password.",
      };
    }

    return { success: true, message: "User signed in successfully" };
  } catch (error) {
    console.error("Error during signin:", error);
    return {
      error: "Something went wrong during sign in. Please try again.",
    };
  }
}
