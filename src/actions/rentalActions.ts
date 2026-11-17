"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import createRental from "@/libs/createRental";
import updateRental from "@/libs/updateRental";
import deleteRental from "@/libs/deleteRental";

const SESSION_EXPIRED = "Your session has expired. Sign in again.";

function toRentalBody(input: RentalInput): RentalInput {
  return {
    equipment: String(input.equipment),
    quantity: Number(input.quantity),
    startDate: String(input.startDate),
    returnDate: String(input.returnDate),
  };
}

export async function createRentalAction(input: RentalInput): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: SESSION_EXPIRED };

  const result = await createRental(session.user.token, toRentalBody(input));
  if (!result.ok) return { error: result.error };

  revalidatePath("/rentals");
  return { error: null };
}

export async function updateRentalAction(
  id: string,
  input: RentalInput
): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: SESSION_EXPIRED };

  const result = await updateRental(session.user.token, id, toRentalBody(input));
  if (!result.ok) return { error: result.error };

  revalidatePath("/rentals");
  return { error: null };
}

export async function deleteRentalAction(id: string): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: SESSION_EXPIRED };

  const result = await deleteRental(session.user.token, id);
  if (!result.ok) return { error: result.error };

  revalidatePath("/rentals");
  return { error: null };
}
