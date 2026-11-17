import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignInForm from "@/components/SignInForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

function toSafePath(value: string | string[] | undefined) {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{
    callbackUrl?: string | string[];
    registered?: string | string[];
  }>;
}) {
  const { callbackUrl, registered } = await searchParams;
  const target = toSafePath(callbackUrl);
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(target);
  }

  return (
    <main className="mx-auto w-full max-w-[480px] px-6 pb-16 pt-12">
      <SignInForm
        callbackUrl={target}
        notice={registered ? "Account created. Sign in to continue." : undefined}
      />
    </main>
  );
}
