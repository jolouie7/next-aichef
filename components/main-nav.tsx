"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

const routes = [
  {
    href: "/create-meal",
    label: "Create Meal",
  },
  {
    href: "/pricing",
    label: "Pricing",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export function MainNav() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleSignin = () => {
    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-0">
        <Link href="/" className="flex items-center space-x-2">
          <Mountain className="h-6 w-6" />
          <span className="font-bold">AI Chef</span>
        </Link>
        <nav className="hidden items-center space-x-6 md:flex">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {/* Desktop */}
          {session ? (
            <button onClick={() => signOut()}>Sign Out</button>
          ) : (
            <>
              <Button
                className="hidden md:inline-flex"
                variant="outline"
                onClick={handleSignin}
              >
                Sign in
              </Button>
              <Button className="hidden md:inline-flex" onClick={handleSignup}>
                Sign up
              </Button>
            </>
          )}

          {/* Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {route.label}
                  </Link>
                ))}
                {session ? (
                  <button onClick={() => signOut()}>Sign Out</button>
                ) : (
                  <>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={handleSignin}
                    >
                      Sign in
                    </Button>
                    <Button className="w-full" onClick={handleSignup}>
                      Sign up
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
