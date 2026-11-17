import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import EquipmentForm from "@/components/EquipmentForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function NewEquipmentPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin?callbackUrl=/equipment/new");
  if (session.user.role !== "admin") redirect("/equipment");

  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col gap-5 px-6 pb-16 pt-8">
      <h1 className="page-title">Add equipment</h1>
      <EquipmentForm
        equipmentId={null}
        initialValues={{
          name: "",
          category: "",
          description: "",
          quantity: "",
          rentalRate: "",
        }}
      />
    </main>
  );
}
