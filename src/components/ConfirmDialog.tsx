"use client";

import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  pending: boolean;
  error: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  pending,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      className="m-auto w-[calc(100%-32px)] max-w-[440px] rounded-xl bg-white p-6 text-ink backdrop:bg-ink/60"
    >
      <div className="flex flex-col gap-3">
        <h2 id="confirm-dialog-title" className="text-xl font-bold">
          {title}
        </h2>
        <p className="text-[15px] text-ink-soft">{message}</p>

        {error ? (
          <div role="alert" className="alert-error">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="btn-secondary min-h-11 px-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="btn-danger"
          >
            {pending ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
