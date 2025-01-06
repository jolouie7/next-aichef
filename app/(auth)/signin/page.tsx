import { Suspense } from "react";

import { Loader2 } from "lucide-react";

import SigninForm from "@/components/signin-form";

export default function SigninPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 fixed inset-0">
      <div className="flex w-full flex-col gap-6">
        <Suspense fallback={<Loader2 className="animate-spin" />}>
          <SigninForm />
        </Suspense>
      </div>
    </div>
  );
}
