import CreateMealForm from "@/components/create-meal-form";

export default function CreateMealPage() {
  return (
    <div className="flex flex-col container mx-auto mt-16">
      <h1 className="text-2xl tracking-tight text-zinc-900 mb-4">
        Create Meal
      </h1>
      <CreateMealForm />
    </div>
  );
}
