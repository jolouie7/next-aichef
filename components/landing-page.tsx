import Image from "next/image";
import { Button } from "./ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image
        src="/aichef-logo.png"
        alt="AI Chef Logo"
        width={400}
        height={300}
      />
      <h1 className="text-4xl font-extrabold leading-none tracking-tight mb-16 text-zinc-900">
        AI Chef
      </h1>
      <Button>Start Cooking!</Button>
    </div>
  );
}
