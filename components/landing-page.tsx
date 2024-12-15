import { Button } from "./ui/button";
import Link from "next/link";
import Logo from "./logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      <Logo />
      <Link href="/create-meal" className="mt-6">
        <Button size="lg">Start Cooking!</Button>
      </Link>
    </div>
  );
}
