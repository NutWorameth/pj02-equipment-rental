import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import EquipmentForm from "@/components/EquipmentForm";
import getEquipment from "@/libs/getEquipment";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect(`/signin?callbackUrl=/equipment/${id}/edit`);
  if (session.user.role !== "admin") redirect("/equipment");

  const result = await getEquipment(id);
  if (!result.ok) notFound();

  const item = result.data;

  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col gap-5 px-6 pb-16 pt-8">
      <h1 className="page-title">Edit equipment</h1>
      <EquipmentForm
        equipmentId={item._id}
        initialValues={{
          name: item.name,
          category: item.category,
          description: item.description,
          quantity: String(item.quantity),
          rentalRate: String(item.rentalRate),
        }}
      />
    </main>
  );
}
