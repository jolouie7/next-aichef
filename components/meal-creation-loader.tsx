import React from "react";
import { Spinner } from "./ui/spinner";
import Logo from "./logo";

export default function MealCreationLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Logo />
      <Spinner size={64} />
    </div>
  );
}
