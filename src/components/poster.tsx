import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
};

export default function Poster({ src, alt, sizes, preload, className }: Props) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
        Tidak ada poster
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={`object-cover ${className ?? ""}`}
    />
  );
}