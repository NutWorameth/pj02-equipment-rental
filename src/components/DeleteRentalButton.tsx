"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ConfirmDialog";
import { deleteRentalAction } from "@/actions/rentalActions";

type DeleteRentalButtonProps = {
  rentalId: string;
  summary: string;
};

export default function DeleteRentalButton({
  rentalId,
  summary,
}: DeleteRentalButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setPending(true);
    setError("");

    const result = await deleteRentalAction(rentalId);

    if (result.error) {
      setPending(false);
      setError(result.error);
      return;
    }

    setPending(false);
    setOpen(false);
    router.push("/rentals?notice=deleted");
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
        className="btn-danger-outline"
      >
        Delete
      </button>

      <ConfirmDialog
        open={open}
        title="Delete this rental request?"
        message={`${summary}. This cannot be undone.`}
        confirmLabel="Delete request"
        pending={pending}
        error={error}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
