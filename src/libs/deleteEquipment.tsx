import backendRequest from "./backendRequest";

export default async function deleteEquipment(token: string, id: string) {
  return await backendRequest<object>(`/equipment/${id}`, {
    method: "DELETE",
    token,
  });
}
