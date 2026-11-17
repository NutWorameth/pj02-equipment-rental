import Link from "next/link";
import { getServerSession } from "next-auth";
import TopMenuItem from "./TopMenuItem";
import SignOutButton from "./SignOutButton";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function TopMenu() {
  const session = await getServerSession(authOptions);
  const role = session?.user.role;

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-6 gap-y-1 px-6 py-2">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-display text-xl font-bold text-ink"
        >
          EquipRent
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-1"
        >
          <TopMenuItem title="Equipment" pageRef="/equipment" />

          {role === "member" ? (
            <TopMenuItem title="My rentals" pageRef="/rentals" />
          ) : null}

          {role === "admin" ? (
            <>
              <TopMenuItem title="All rentals" pageRef="/rentals" />
              <TopMenuItem title="Add equipment" pageRef="/equipment/new" />
            </>
          ) : null}

          {session ? (
            <>
              <span
                className={
                  role === "admin"
                    ? "text-sm font-semibold text-admin"
                    : "text-sm text-ink-soft"
                }
              >
                {session.user.name}
                {role === "admin" ? " (admin)" : ""}
              </span>
              <SignOutButton />
            </>
          ) : (
            <>
              <TopMenuItem title="Sign in" pageRef="/signin" />
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 font-semibold text-white hover:bg-accent-dark"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
