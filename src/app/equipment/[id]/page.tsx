import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import DeleteEquipmentButton from "@/components/DeleteEquipmentButton";
import getEquipment from "@/libs/getEquipment";
import { formatBaht, formatPieces } from "@/libs/format";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const role = session?.user.role;
  const result = await getEquipment(id);

  if (!result.ok) {
    if (result.status === 404 || result.status === 500) notFound();

    return (
      <main className="mx-auto flex w-full max-w-[1120px] flex-col items-start gap-4 px-6 pb-16 pt-8">
        <div role="alert" className="alert-error">
          {result.error}
        </div>
        <Link href="/equipment" className="btn-outline">
          Back to equipment
        </Link>
      </main>
    );
  }

  const item = result.data;

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 px-6 pb-16 pt-8">
      <Link
        href="/equipment"
        className="inline-flex min-h-11 items-center self-start font-semibold text-accent hover:text-accent-dark"
      >
        &larr; All equipment
      </Link>

      <div className="flex flex-wrap gap-6">
        <section className="card flex min-w-0 flex-[999_1_480px] flex-col gap-3.5 p-7">
          <div className="self-start rounded-full bg-accent-soft px-2.5 py-0.5 text-[13px] font-semibold text-[#0a4a8a]">
            {item.category}
          </div>
          <h1 className="page-title">{item.name}</h1>
          <p className="text-ink-soft">{item.description}</p>

          <dl className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
            <div className="rounded-[10px] border border-line px-4 py-3.5">
              <dt className="text-[13px] text-muted">Available</dt>
              <dd className="text-[22px] font-bold">{formatPieces(item.quantity)}</dd>
            </div>
            <div className="rounded-[10px] border border-line px-4 py-3.5">
              <dt className="text-[13px] text-muted">Rental rate</dt>
              <dd className="text-[22px] font-bold">
                {formatBaht(item.rentalRate)} per piece per day
              </dd>
            </div>
          </dl>
        </section>

        <aside className="card flex min-w-0 flex-[1_1_300px] flex-col gap-3 self-start p-6">
          {role === "member" ? (
            <>
              <Link href={`/rentals/new?equipment=${item._id}`} className="btn-primary">
                Rent this item
              </Link>
              <p className="field-hint">
                Up to 3 pieces per request, for up to 7 days.
              </p>
            </>
          ) : null}

          {role === "admin" ? (
            <>
              <div className="text-[13px] font-bold text-admin">Admin</div>
              <div className="flex gap-2">
                <Link href={`/equipment/${item._id}/edit`} className="btn-outline flex-1">
                  Edit
                </Link>
                <DeleteEquipmentButton
                  equipmentId={item._id}
                  equipmentName={item.name}
                  className="btn-danger-outline flex-1"
                />
              </div>
              <p className="field-hint">Admins manage equipment but cannot rent it.</p>
            </>
          ) : null}

          {!session ? (
            <>
              <Link
                href={`/signin?callbackUrl=${encodeURIComponent(`/equipment/${item._id}`)}`}
                className="btn-outline min-h-12"
              >
                Sign in to rent
              </Link>
              <p className="field-hint">
                You need a member account to send a rental request.
              </p>
            </>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
