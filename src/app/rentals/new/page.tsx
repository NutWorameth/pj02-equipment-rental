import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import RentalForm from "@/components/RentalForm";
import RentalRules from "@/components/RentalRules";
import getEquipmentList from "@/libs/getEquipmentList";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function NewRentalPage({
  searchParams,
}: {
  searchParams: Promise<{ equipment?: string | string[] }>;
}) {
  const { equipment } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin?callbackUrl=/equipment");
  if (session.user.role !== "member") redirect("/rentals");

  const result = await getEquipmentList();
  const requestedId = typeof equipment === "string" ? equipment : "";

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 px-6 pb-16 pt-8">
      <h1 className="page-title">New rental request</h1>

      {result.ok ? (
        <div className="flex flex-wrap items-start gap-6">
          <RentalForm
            rentalId={null}
            equipmentOptions={result.data}
            initialValues={{
              equipment: result.data.some((item) => item._id === requestedId)
                ? requestedId
                : "",
              quantity: "1",
              startDate: "",
              returnDate: "",
            }}
            cancelHref={requestedId ? `/equipment/${requestedId}` : "/equipment"}
          />
          <RentalRules />
        </div>
      ) : (
        <div className="card flex flex-col items-start gap-3 p-8">
          <div role="alert" className="alert-error">
            {result.error}
          </div>
          <Link href="/equipment" className="btn-outline">
            Back to equipment
          </Link>
        </div>
      )}
    </main>
  );
}
