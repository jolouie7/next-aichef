import { ProtectedRoute } from "@/components/auth/protected-route";
import CreateMealForm from "@/components/create-meal-form";

export default function CreateMealPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col container mx-auto mt-12 px-4 md:px-0">
        <h1 className="text-2xl tracking-tight text-zinc-900 mb-4">
          Create Meal
        </h1>
        <CreateMealForm />
      </div>
    </ProtectedRoute>
  );
}
