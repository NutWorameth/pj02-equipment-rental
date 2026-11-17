import Link from "next/link";

type TopMenuItemProps = {
  title: string;
  pageRef: string;
};

export default function TopMenuItem({ title, pageRef }: TopMenuItemProps) {
  return (
    <Link
      href={pageRef}
      className="inline-flex min-h-11 items-center font-medium text-accent hover:text-accent-dark"
    >
      {title}
    </Link>
  );
}
