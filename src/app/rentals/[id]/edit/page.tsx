import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import RentalForm from "@/components/RentalForm";
import RentalRules from "@/components/RentalRules";
import getEquipmentList from "@/libs/getEquipmentList";
import getRental from "@/libs/getRental";
import { toDateInput } from "@/libs/format";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function EditRentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/signin?callbackUrl=/rentals");

  const [rentalResult, equipmentResult] = await Promise.all([
    getRental(session.user.token, id),
    getEquipmentList(),
  ]);

  if (!rentalResult.ok) {
    if (rentalResult.status === 404 || rentalResult.status === 500) notFound();

    return (
      <main className="mx-auto flex w-full max-w-[1120px] flex-col items-start gap-4 px-6 pb-16 pt-8">
        <div role="alert" className="alert-error">
          {rentalResult.error}
        </div>
        <Link href="/rentals" className="btn-outline">
          Back to rentals
        </Link>
      </main>
    );
  }

  const rental = rentalResult.data;
  const options = equipmentResult.ok ? equipmentResult.data : [];
  const currentId = rental.equipment?._id ?? "";
  const stillListed = options.some((item) => item._id === currentId);
  const isAdmin = session.user.role === "admin";

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 px-6 pb-16 pt-8">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">Edit rental request</h1>
        {isAdmin && rental.user ? (
          <p className="text-sm text-ink-soft">
            Requested by {rental.user.name} ({rental.user.email})
          </p>
        ) : null}
      </div>

      {!stillListed ? (
        <div role="status" className="alert-info">
          The item on this request is no longer listed. Choose another item to
          save changes, or delete the request.
        </div>
      ) : null}

      <div className="flex flex-wrap items-start gap-6">
        <RentalForm
          rentalId={rental._id}
          equipmentOptions={options}
          initialValues={{
            equipment: stillListed ? currentId : "",
            quantity: String(rental.quantity),
            startDate: toDateInput(rental.startDate),
            returnDate: toDateInput(rental.returnDate),
          }}
          cancelHref="/rentals"
        />
        <RentalRules />
      </div>
    </main>
  );
}
