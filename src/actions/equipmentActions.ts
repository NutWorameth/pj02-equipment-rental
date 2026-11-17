"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import createEquipment from "@/libs/createEquipment";
import updateEquipment from "@/libs/updateEquipment";
import deleteEquipment from "@/libs/deleteEquipment";

const SESSION_EXPIRED = "Your session has expired. Sign in again.";
const DUPLICATE_NAME =
  "An item with this name already exists, or existed before it was deleted. Use a different name.";

function toEquipmentBody(input: EquipmentInput): EquipmentInput {
  return {
    name: String(input.name).trim(),
    category: String(input.category).trim(),
    description: String(input.description).trim(),
    quantity: Number(input.quantity),
    rentalRate: Number(input.rentalRate),
  };
}

export async function saveEquipmentAction(
  id: string | null,
  input: EquipmentInput
): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: SESSION_EXPIRED };

  const body = toEquipmentBody(input);
  const result = id
    ? await updateEquipment(session.user.token, id, body)
    : await createEquipment(session.user.token, body);

  if (!result.ok) {
    return { error: result.error === "DUPLICATE" ? DUPLICATE_NAME : result.error };
  }

  revalidatePath("/equipment");
  return { error: null };
}

export async function deleteEquipmentAction(id: string): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session) return { error: SESSION_EXPIRED };

  const result = await deleteEquipment(session.user.token, id);
  if (!result.ok) return { error: result.error };

  revalidatePath("/equipment");
  return { error: null };
}
