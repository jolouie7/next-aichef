import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import Logo from "./logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Logo />
      <Link href="/create-meal">
        <Button>Start Cooking!</Button>
      </Link>
    </div>
  );
}
