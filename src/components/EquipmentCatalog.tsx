"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteEquipmentButton from "./DeleteEquipmentButton";
import { formatBaht } from "@/libs/format";

type EquipmentCatalogProps = {
  items: EquipmentItem[];
  isAdmin: boolean;
};

const adminButton =
  "inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-lg border border-admin bg-white px-4 text-sm font-semibold text-admin hover:bg-admin-soft";

export default function EquipmentCatalog({ items, isAdmin }: EquipmentCatalogProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  const categories = Array.from(new Set(items.map((item) => item.category))).sort();
  const search = keyword.trim().toLowerCase();

  const visibleItems = items.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    const matchesKeyword =
      search === "" ||
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search);

    return matchesCategory && matchesKeyword;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex min-w-[220px] flex-[2_1_260px] flex-col gap-1.5">
          <label htmlFor="equipment-search" className="field-label">
            Search
          </label>
          <input
            id="equipment-search"
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Name or description"
            className="field-input"
          />
        </div>

        <div className="flex min-w-[180px] flex-[1_1_180px] flex-col gap-1.5">
          <label htmlFor="equipment-category" className="field-label">
            Category
          </label>
          <select
            id="equipment-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="field-input"
          >
            <option value="all">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div role="status" className="text-sm text-ink-soft">
        Showing {visibleItems.length} of {items.length} items
      </div>

      {visibleItems.length === 0 ? (
        <div className="card p-8 text-center text-ink-soft">
          No equipment matches your search.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {visibleItems.map((item) => (
            <article key={item._id} className="card flex flex-col gap-2.5 p-5">
              <div className="self-start rounded-full bg-accent-soft px-2.5 py-0.5 text-[13px] font-semibold text-[#0a4a8a]">
                {item.category}
              </div>
              <h2 className="text-lg font-bold leading-snug">{item.name}</h2>
              <p className="text-sm text-ink-soft">{item.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <span>
                  <b>{item.quantity}</b> available
                </span>
                <span>
                  <b>{formatBaht(item.rentalRate)}</b> per day
                </span>
              </div>

              <Link
                href={`/equipment/${item._id}`}
                className="btn-primary mt-auto min-h-11"
              >
                View details
              </Link>

              {isAdmin ? (
                <div className="flex gap-2">
                  <Link href={`/equipment/${item._id}/edit`} className={adminButton}>
                    Edit
                  </Link>
                  <DeleteEquipmentButton
                    equipmentId={item._id}
                    equipmentName={item.name}
                    className={adminButton}
                  />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
