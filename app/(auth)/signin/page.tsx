import { Suspense } from "react";

import MealCreationLoader from "@/components/meal-creation-loader";
import SigninForm from "@/components/signin-form";

export default function SigninPage() {
  return (
    <Suspense fallback={<MealCreationLoader />}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 fixed inset-0">
        <div className="flex w-full flex-col gap-6">
          <SigninForm />
        </div>
      </div>
    </Suspense>
  );
}
