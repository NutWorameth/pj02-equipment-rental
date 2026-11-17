export default function RentalRules() {
  return (
    <aside className="card flex min-w-0 flex-[1_1_320px] flex-col gap-3 self-start p-6">
      <h2 className="text-lg font-bold">Rental rules</h2>
      <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm">
        <li>Start date is today or later.</li>
        <li>Return date is the start date or later.</li>
        <li>Quantity is not more than the pieces available.</li>
        <li>Quantity is 1 to 3 per request.</li>
        <li>Rental length is 7 days or less.</li>
      </ol>
      <p className="field-hint">
        A request does not change the number of pieces available.
      </p>
    </aside>
  );
}
