"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex min-h-11 cursor-pointer items-center rounded-lg border border-field bg-white px-4 font-semibold text-ink hover:bg-ground"
    >
      Sign out
    </button>
  );
}
