"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ConfirmDialog";
import { deleteEquipmentAction } from "@/actions/equipmentActions";

type DeleteEquipmentButtonProps = {
  equipmentId: string;
  equipmentName: string;
  className?: string;
};

export default function DeleteEquipmentButton({
  equipmentId,
  equipmentName,
  className,
}: DeleteEquipmentButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setPending(true);
    setError("");

    const result = await deleteEquipmentAction(equipmentId);

    if (result.error) {
      setPending(false);
      setError(result.error);
      return;
    }

    setPending(false);
    setOpen(false);
    router.push("/equipment?notice=deleted");
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
        className={className ?? "btn-danger-outline"}
      >
        Delete
      </button>

      <ConfirmDialog
        open={open}
        title="Delete this equipment?"
        message={`${equipmentName} will no longer be listed or available to rent. Existing rental requests for it stay in the list.`}
        confirmLabel="Delete equipment"
        pending={pending}
        error={error}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
