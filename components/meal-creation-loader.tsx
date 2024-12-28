"use client";

import React from "react";

import Logo from "@/components/logo";
import { Spinner } from "@/components/ui/spinner";

export default function MealCreationLoader() {
  return (
    <div className="fixed inset-0 top-16 flex flex-col items-center justify-center bg-background">
      <Logo />
      <Spinner size={64} />
    </div>
  );
}
