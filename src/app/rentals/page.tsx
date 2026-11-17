import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import DeleteRentalButton from "@/components/DeleteRentalButton";
import getRentals from "@/libs/getRentals";
import { formatDate, formatPieces } from "@/libs/format";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const notices: Record<string, string> = {
  created: "Rental request submitted.",
  updated: "Rental request updated.",
  deleted: "Rental request deleted.",
};

export default async function RentalsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const { notice } = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin?callbackUrl=/rentals");
  }

  const isAdmin = session.user.role === "admin";
  const result = await getRentals(session.user.token);
  const noticeText = typeof notice === "string" ? notices[notice] : undefined;
  const rentals = result.ok ? result.data : [];

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-5 px-6 pb-16 pt-8">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">{isAdmin ? "All rentals" : "My rentals"}</h1>
        <p className="text-sm text-ink-soft">
          {isAdmin
            ? "Rental requests from all members. You can edit or delete any request."
            : "Only your own rental requests are listed here."}
        </p>
      </div>

      {noticeText ? (
        <div role="status" className="alert-info">
          {noticeText}
        </div>
      ) : null}

      {!result.ok ? (
        <div className="card flex flex-col items-start gap-3 p-8">
          <div role="alert" className="alert-error">
            {result.error}
          </div>
          <Link href="/rentals" className="btn-outline">
            Retry
          </Link>
        </div>
      ) : null}

      {result.ok && rentals.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <p className="text-ink-soft">
            {isAdmin
              ? "No member has sent a rental request yet."
              : "You have no rental requests yet."}
          </p>
          {isAdmin ? null : (
            <Link href="/equipment" className="btn-primary">
              Browse equipment
            </Link>
          )}
        </div>
      ) : null}

      {result.ok && rentals.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-[15px]">
            <thead>
              <tr className="bg-[#eef1f5] text-left">
                {isAdmin ? (
                  <th scope="col" className="px-4 py-3 text-[13px] text-ink-soft">
                    Member
                  </th>
                ) : null}
                <th scope="col" className="px-4 py-3 text-[13px] text-ink-soft">
                  Equipment
                </th>
                <th scope="col" className="px-4 py-3 text-[13px] text-ink-soft">
                  Quantity
                </th>
                <th scope="col" className="px-4 py-3 text-[13px] text-ink-soft">
                  Start date
                </th>
                <th scope="col" className="px-4 py-3 text-[13px] text-ink-soft">
                  Return date
                </th>
                <th scope="col" className="px-4 py-3 text-[13px] text-ink-soft">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) => {
                const equipmentName = rental.equipment?.name ?? "Deleted item";
                const summary = `${equipmentName}, ${formatPieces(rental.quantity)}, ${formatDate(rental.startDate)} to ${formatDate(rental.returnDate)}`;

                return (
                  <tr key={rental._id} className="border-t border-line">
                    {isAdmin ? (
                      <td className="px-4 py-3">
                        <b>{rental.user?.name ?? "Unknown user"}</b>
                        <br />
                        <span className="text-[13px] text-muted">
                          {rental.user?.email ?? ""}
                        </span>
                      </td>
                    ) : null}
                    <td className="px-4 py-3">
                      <b>{equipmentName}</b>
                      <br />
                      <span className="text-[13px] text-muted">
                        {rental.equipment?.isActive === false
                          ? "No longer listed"
                          : (rental.equipment?.category ?? "")}
                      </span>
                    </td>
                    <td className="px-4 py-3">{rental.quantity}</td>
                    <td className="px-4 py-3">{formatDate(rental.startDate)}</td>
                    <td className="px-4 py-3">{formatDate(rental.returnDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/rentals/${rental._id}/edit`}
                          className="btn-outline"
                        >
                          Edit
                        </Link>
                        <DeleteRentalButton rentalId={rental._id} summary={summary} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </main>
  );
}
