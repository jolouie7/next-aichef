import Image from "next/image";

export default function Logo({
  height = 100,
  width = 100,
}: {
  height?: number;
  width?: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src="/aichef-logo.png"
        alt="AI Chef Logo"
        height={height}
        width={width}
      />
      <h1 className="text-4xl font-extrabold leading-none tracking-tight mb-16 text-zinc-900">
        AI Chef
      </h1>
    </div>
  );
}
