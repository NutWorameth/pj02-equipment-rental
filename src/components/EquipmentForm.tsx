"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveEquipmentAction } from "@/actions/equipmentActions";
import {
  validateEquipment,
  type EquipmentFormErrors,
  type EquipmentFormValues,
} from "@/libs/equipmentRules";

type EquipmentFormProps = {
  equipmentId: string | null;
  initialValues: EquipmentFormValues;
};

export default function EquipmentForm({
  equipmentId,
  initialValues,
}: EquipmentFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<EquipmentFormValues>(initialValues);
  const [errors, setErrors] = useState<EquipmentFormErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const setField = (field: keyof EquipmentFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const nextErrors = validateEquipment(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);

    const result = await saveEquipmentAction(equipmentId, {
      name: values.name.trim(),
      category: values.category.trim(),
      description: values.description.trim(),
      quantity: Number(values.quantity),
      rentalRate: Number(values.rentalRate),
    });

    if (result.error) {
      setPending(false);
      setFormError(result.error);
      return;
    }

    router.push(`/equipment?notice=${equipmentId ? "updated" : "created"}`);
    router.refresh();
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      noValidate
      className="card flex flex-col gap-[18px] p-7"
    >
      {formError ? (
        <div role="alert" className="alert-error">
          {formError}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="equipment-name" className="field-label">
          Name
        </label>
        <input
          id="equipment-name"
          name="name"
          type="text"
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "equipment-name-error" : "equipment-name-hint"}
          className={`field-input ${errors.name ? "field-input-error" : ""}`}
        />
        {errors.name ? (
          <div id="equipment-name-error" className="field-error">
            {errors.name}
          </div>
        ) : (
          <div id="equipment-name-hint" className="field-hint">
            Must be different from every other item name.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="equipment-category-input" className="field-label">
          Category
        </label>
        <input
          id="equipment-category-input"
          name="category"
          type="text"
          value={values.category}
          onChange={(event) => setField("category", event.target.value)}
          aria-invalid={errors.category ? true : undefined}
          aria-describedby={errors.category ? "equipment-category-error" : undefined}
          className={`field-input ${errors.category ? "field-input-error" : ""}`}
        />
        {errors.category ? (
          <div id="equipment-category-error" className="field-error">
            {errors.category}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="equipment-description" className="field-label">
          Description
        </label>
        <textarea
          id="equipment-description"
          name="description"
          rows={3}
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={
            errors.description ? "equipment-description-error" : undefined
          }
          className={`field-input ${errors.description ? "field-input-error" : ""}`}
        />
        {errors.description ? (
          <div id="equipment-description-error" className="field-error">
            {errors.description}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="equipment-quantity" className="field-label">
            Quantity available
          </label>
          <input
            id="equipment-quantity"
            name="quantity"
            type="number"
            min={0}
            step={1}
            value={values.quantity}
            onChange={(event) => setField("quantity", event.target.value)}
            aria-invalid={errors.quantity ? true : undefined}
            aria-describedby={
              errors.quantity ? "equipment-quantity-error" : "equipment-quantity-hint"
            }
            className={`field-input ${errors.quantity ? "field-input-error" : ""}`}
          />
          {errors.quantity ? (
            <div id="equipment-quantity-error" className="field-error">
              {errors.quantity}
            </div>
          ) : (
            <div id="equipment-quantity-hint" className="field-hint">
              Whole number, 0 or more.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="equipment-rate" className="field-label">
            Rental rate (THB per piece per day)
          </label>
          <input
            id="equipment-rate"
            name="rentalRate"
            type="number"
            min={0}
            value={values.rentalRate}
            onChange={(event) => setField("rentalRate", event.target.value)}
            aria-invalid={errors.rentalRate ? true : undefined}
            aria-describedby={
              errors.rentalRate ? "equipment-rate-error" : "equipment-rate-hint"
            }
            className={`field-input ${errors.rentalRate ? "field-input-error" : ""}`}
          />
          {errors.rentalRate ? (
            <div id="equipment-rate-error" className="field-error">
              {errors.rentalRate}
            </div>
          ) : (
            <div id="equipment-rate-hint" className="field-hint">
              0 or more.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving..." : equipmentId ? "Save changes" : "Save equipment"}
        </button>
        <Link href="/equipment" className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
