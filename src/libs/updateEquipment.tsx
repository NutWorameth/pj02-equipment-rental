import backendRequest from "./backendRequest";

export default async function updateEquipment(
  token: string,
  id: string,
  input: EquipmentInput
) {
  return await backendRequest<EquipmentItem>(`/equipment/${id}`, {
    method: "PUT",
    token,
    body: input,
  });
}
