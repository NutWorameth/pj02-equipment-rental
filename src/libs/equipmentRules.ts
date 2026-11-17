export type EquipmentFormValues = {
  name: string;
  category: string;
  description: string;
  quantity: string;
  rentalRate: string;
};

export type EquipmentFormErrors = Partial<Record<keyof EquipmentFormValues, string>>;

export function validateEquipment(values: EquipmentFormValues) {
  const errors: EquipmentFormErrors = {};
  const quantity = Number(values.quantity);
  const rentalRate = Number(values.rentalRate);

  if (!values.name.trim()) errors.name = "Enter a name.";
  if (!values.category.trim()) errors.category = "Enter a category.";
  if (!values.description.trim()) errors.description = "Enter a description.";

  if (values.quantity.trim() === "" || !Number.isInteger(quantity) || quantity < 0) {
    errors.quantity = "Enter a whole number, 0 or more.";
  }

  if (values.rentalRate.trim() === "" || Number.isNaN(rentalRate) || rentalRate < 0) {
    errors.rentalRate = "Enter a number, 0 or more.";
  }

  return errors;
}
