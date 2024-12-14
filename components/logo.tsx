import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/aichef-logo.png"
        alt="AI Chef Logo"
        width={400}
        height={300}
      />
      <h1 className="text-4xl font-extrabold leading-none tracking-tight mb-16 text-zinc-900">
        AI Chef
      </h1>
    </div>
  );
}
