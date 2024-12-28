import Link from "next/link";

import Logo from "./logo";
import { Button } from "./ui/button";

export default function LandingPage() {
  return (
    <div className="fixed inset-0 top-16 flex flex-col items-center justify-center bg-background">
      <Logo />
      <Link href="/create-meal" className="mt-6">
        <Button size="lg">Start Cooking!</Button>
      </Link>
    </div>
  );
}
