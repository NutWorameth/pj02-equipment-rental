export const MAX_QUANTITY = 3;
export const MAX_DAYS = 7;

export type RentalFormValues = {
  equipment: string;
  quantity: string;
  startDate: string;
  returnDate: string;
};

export type RentalFormErrors = Partial<Record<keyof RentalFormValues, string>>;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function getToday(now: Date = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function countDays(startDate: string, returnDate: string) {
  if (!DATE_PATTERN.test(startDate) || !DATE_PATTERN.test(returnDate)) {
    return null;
  }

  const start = Date.parse(`${startDate}T00:00:00.000Z`);
  const end = Date.parse(`${returnDate}T00:00:00.000Z`);

  if (Number.isNaN(start) || Number.isNaN(end)) return null;

  return Math.round((end - start) / (24 * 60 * 60 * 1000));
}

export function validateRental(
  values: RentalFormValues,
  available: number | null,
  today: string
) {
  const errors: RentalFormErrors = {};
  const quantity = Number(values.quantity);

  if (!values.equipment) {
    errors.equipment = "Choose an item to rent.";
  }

  if (values.quantity.trim() === "" || !Number.isInteger(quantity) || quantity < 1) {
    errors.quantity = "Enter a whole number from 1 to 3.";
  } else if (quantity > MAX_QUANTITY) {
    errors.quantity = "You can rent up to 3 pieces per request.";
  } else if (available !== null && quantity > available) {
    errors.quantity =
      available === 1
        ? "Only 1 piece of this item is available."
        : `Only ${available} pieces of this item are available.`;
  }

  if (!DATE_PATTERN.test(values.startDate)) {
    errors.startDate = "Choose a start date.";
  } else if (values.startDate < today) {
    errors.startDate = "Start date cannot be in the past.";
  }

  if (!DATE_PATTERN.test(values.returnDate)) {
    errors.returnDate = "Choose a return date.";
  } else if (DATE_PATTERN.test(values.startDate)) {
    const days = countDays(values.startDate, values.returnDate);

    if (days !== null && days < 0) {
      errors.returnDate = "Return date cannot be before the start date.";
    } else if (days !== null && days > MAX_DAYS) {
      errors.returnDate = "A rental cannot be longer than 7 days.";
    }
  }

  return errors;
}
