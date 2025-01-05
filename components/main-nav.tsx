"use client";

import Link from "next/link";

import { Mountain } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routes = [
  {
    href: "/create-meal",
    label: "Create Meal",
  },
  {
    href: "/my-meals",
    label: "My Meals",
  },
];

export function MainNav() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-0">
        <Link href="/" className="flex items-center space-x-2">
          <Mountain className="h-6 w-6" />
          <span className="text-lg font-semibold">AI Chef</span>
        </Link>
        <div className="ml-auto hidden md:flex md:items-center md:gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
        </div>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer ml-4">
                <AvatarImage src={session.user?.profilePicture || ""} />
                <AvatarFallback>
                  {session.user?.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span>{session.user?.email}</span>
              </DropdownMenuItem>
              {routes.map((route) => (
                <DropdownMenuItem key={route.href}>
                  <Link href={route.href}>{route.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
      </div>
    </nav>
  );
}
