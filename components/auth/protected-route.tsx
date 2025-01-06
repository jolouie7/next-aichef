"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoaderCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/signin?callbackUrl=${pathname}`);
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="animate-spin" size={32} />
      </div>
    );
  }

  return status === "authenticated" ? children : null;
}
