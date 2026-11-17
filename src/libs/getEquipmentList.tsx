import backendRequest from "./backendRequest";

export default async function getEquipmentList() {
  return await backendRequest<EquipmentItem[]>("/equipment");
}
