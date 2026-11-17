import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import RegisterForm from "@/components/RegisterForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <main className="mx-auto w-full max-w-[480px] px-6 pb-16 pt-12">
      <RegisterForm />
    </main>
  );
}
