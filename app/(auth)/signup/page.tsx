import SignupForm from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 fixed inset-0">
      <div className="flex w-full flex-col gap-6">
        <SignupForm />
      </div>
    </div>
  );
}
