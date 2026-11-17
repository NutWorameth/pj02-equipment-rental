import backendRequest from "./backendRequest";

export default async function getEquipment(id: string) {
  return await backendRequest<EquipmentItem>(`/equipment/${id}`);
}
