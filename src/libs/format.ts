const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return dateFormatter.format(date);
}

export function toDateInput(value: string) {
  return value.slice(0, 10);
}

export function formatBaht(value: number) {
  return `${value.toLocaleString("en-US")} THB`;
}

export function formatPieces(value: number) {
  return value === 1 ? "1 piece" : `${value} pieces`;
}
