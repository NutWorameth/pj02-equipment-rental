"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRentalAction, updateRentalAction } from "@/actions/rentalActions";
import { formatBaht } from "@/libs/format";
import {
  MAX_DAYS,
  MAX_QUANTITY,
  countDays,
  getToday,
  validateRental,
  type RentalFormErrors,
  type RentalFormValues,
} from "@/libs/rentalRules";

type RentalFormProps = {
  rentalId: string | null;
  equipmentOptions: EquipmentItem[];
  initialValues: RentalFormValues;
  cancelHref: string;
};

export default function RentalForm({
  rentalId,
  equipmentOptions,
  initialValues,
  cancelHref,
}: RentalFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<RentalFormValues>(initialValues);
  const [errors, setErrors] = useState<RentalFormErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const selected = equipmentOptions.find((item) => item._id === values.equipment);
  const days = countDays(values.startDate, values.returnDate);

  const setField = (field: keyof RentalFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const nextErrors = validateRental(
      values,
      selected ? selected.quantity : null,
      getToday()
    );
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);

    const input: RentalInput = {
      equipment: values.equipment,
      quantity: Number(values.quantity),
      startDate: values.startDate,
      returnDate: values.returnDate,
    };

    const result = rentalId
      ? await updateRentalAction(rentalId, input)
      : await createRentalAction(input);

    if (result.error) {
      setPending(false);
      setFormError(result.error);
      return;
    }

    router.push(`/rentals?notice=${rentalId ? "updated" : "created"}`);
    router.refresh();
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      noValidate
      className="card flex min-w-0 flex-[999_1_480px] flex-col gap-[18px] p-7"
    >
      {formError ? (
        <div role="alert" className="alert-error">
          {formError}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="rental-equipment" className="field-label">
          Equipment
        </label>
        <select
          id="rental-equipment"
          name="equipment"
          value={values.equipment}
          onChange={(event) => setField("equipment", event.target.value)}
          aria-invalid={errors.equipment ? true : undefined}
          aria-describedby={
            errors.equipment ? "rental-equipment-error" : "rental-equipment-hint"
          }
          className={`field-input ${errors.equipment ? "field-input-error" : ""}`}
        >
          <option value="">Choose an item</option>
          {equipmentOptions.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
        {errors.equipment ? (
          <div id="rental-equipment-error" className="field-error">
            {errors.equipment}
          </div>
        ) : (
          <div id="rental-equipment-hint" className="field-hint">
            {selected
              ? `${selected.quantity} available, ${formatBaht(selected.rentalRate)} per piece per day`
              : "Pick the item you want to rent."}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="rental-quantity" className="field-label">
          Quantity
        </label>
        <input
          id="rental-quantity"
          name="quantity"
          type="number"
          min={1}
          max={MAX_QUANTITY}
          step={1}
          value={values.quantity}
          onChange={(event) => setField("quantity", event.target.value)}
          aria-invalid={errors.quantity ? true : undefined}
          aria-describedby={
            errors.quantity ? "rental-quantity-error" : "rental-quantity-hint"
          }
          className={`field-input ${errors.quantity ? "field-input-error" : ""}`}
        />
        {errors.quantity ? (
          <div id="rental-quantity-error" className="field-error">
            {errors.quantity}
          </div>
        ) : (
          <div id="rental-quantity-hint" className="field-hint">
            1 to {MAX_QUANTITY} pieces, and not more than the number available.
          </div>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rental-start" className="field-label">
            Start date
          </label>
          <input
            id="rental-start"
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={(event) => setField("startDate", event.target.value)}
            aria-invalid={errors.startDate ? true : undefined}
            aria-describedby={errors.startDate ? "rental-start-error" : undefined}
            className={`field-input ${errors.startDate ? "field-input-error" : ""}`}
          />
          {errors.startDate ? (
            <div id="rental-start-error" className="field-error">
              {errors.startDate}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="rental-return" className="field-label">
            Return date
          </label>
          <input
            id="rental-return"
            name="returnDate"
            type="date"
            value={values.returnDate}
            onChange={(event) => setField("returnDate", event.target.value)}
            aria-invalid={errors.returnDate ? true : undefined}
            aria-describedby={errors.returnDate ? "rental-return-error" : undefined}
            className={`field-input ${errors.returnDate ? "field-input-error" : ""}`}
          />
          {errors.returnDate ? (
            <div id="rental-return-error" className="field-error">
              {errors.returnDate}
            </div>
          ) : null}
        </div>
      </div>

      <div role="status" className="text-sm text-ink-soft">
        {days !== null && days >= 0
          ? `Rental length: ${days} ${days === 1 ? "day" : "days"} (maximum ${MAX_DAYS})`
          : `Rental length: choose both dates (maximum ${MAX_DAYS} days)`}
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving..." : rentalId ? "Save changes" : "Submit request"}
        </button>
        <Link href={cancelHref} className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
