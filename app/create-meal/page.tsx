import CreateMealForm from "@/components/create-meal-form";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function CreateMealPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col container mx-auto mt-16">
        <h1 className="text-2xl tracking-tight text-zinc-900 mb-4">
          Create Meal
        </h1>
        <CreateMealForm />
      </div>
    </ProtectedRoute>
  );
}
