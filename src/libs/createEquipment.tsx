import backendRequest from "./backendRequest";

export default async function createEquipment(
  token: string,
  input: EquipmentInput
) {
  return await backendRequest<EquipmentItem>("/equipment", {
    method: "POST",
    token,
    body: input,
  });
}
