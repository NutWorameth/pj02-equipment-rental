import backendRequest from "./backendRequest";

export default async function deleteRental(token: string, id: string) {
  return await backendRequest<object>(`/rentals/${id}`, {
    method: "DELETE",
    token,
  });
}
