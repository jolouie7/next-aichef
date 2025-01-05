import Image from "next/image";
import { Suspense } from "react";

import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 fixed inset-0">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md">
              <Image
                src="/aichef-logo.png"
                alt="Ai Chef Logo"
                width={40}
                height={40}
              />
            </div>
            AI Chef
          </a>
          <SignupForm />
        </div>
      </div>
    </Suspense>
  );
}
