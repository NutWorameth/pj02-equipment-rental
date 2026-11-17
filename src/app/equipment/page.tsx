import Link from "next/link";
import { getServerSession } from "next-auth";
import EquipmentCatalog from "@/components/EquipmentCatalog";
import getEquipmentList from "@/libs/getEquipmentList";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const notices: Record<string, string> = {
  created: "Equipment added.",
  updated: "Equipment updated.",
  deleted: "Equipment deleted.",
};

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const { notice } = await searchParams;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "admin";
  const result = await getEquipmentList();
  const noticeText = typeof notice === "string" ? notices[notice] : undefined;

  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-6 pb-16 pt-10">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">Equipment</h1>
          <p className="text-sm text-ink-soft">
            Browse what is available, then open an item to rent it.
          </p>
        </div>

        {isAdmin ? (
          <Link href="/equipment/new" className="btn-primary ml-auto min-h-11 px-4">
            Add equipment
          </Link>
        ) : null}
      </div>

      {noticeText ? (
        <div role="status" className="alert-info">
          {noticeText}
        </div>
      ) : null}

      {result.ok ? (
        <EquipmentCatalog items={result.data} isAdmin={isAdmin} />
      ) : (
        <div className="card flex flex-col items-start gap-3 p-8">
          <div role="alert" className="alert-error">
            {result.error}
          </div>
          <Link href="/equipment" className="btn-outline">
            Retry
          </Link>
        </div>
      )}
    </main>
  );
}
