import Link from "next/link";

const steps = [
  {
    label: "Step 1",
    title: "Pick an item",
    detail: "See what is available and the rate per day.",
  },
  {
    label: "Step 2",
    title: "Choose quantity and dates",
    detail: "Up to 3 pieces per request, for up to 7 days.",
  },
  {
    label: "Step 3",
    title: "Send your request",
    detail: "Edit or delete it later from My rentals.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-14 px-6 pb-16 pt-18">
      <section className="flex max-w-[720px] flex-col items-start gap-5">
        <h1 className="font-display text-5xl font-bold leading-[1.1]">
          Borrow the gear you need, by the day
        </h1>
        <p className="text-lg text-ink-soft">
          Cameras, projectors, notebooks and sports equipment. Pick an item,
          choose your dates and send a rental request.
        </p>
        <Link
          href="/equipment"
          className="inline-flex min-h-12 items-center rounded-lg bg-accent px-6 font-semibold text-white hover:bg-accent-dark"
        >
          Browse equipment
        </Link>
      </section>

      <section
        aria-label="How it works"
        className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4"
      >
        {steps.map((step) => (
          <div
            key={step.label}
            className="flex flex-col gap-1.5 rounded-xl border border-line bg-white p-5"
          >
            <div className="text-[13px] font-bold text-accent">{step.label}</div>
            <div className="font-semibold">{step.title}</div>
            <div className="text-sm text-ink-soft">{step.detail}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
