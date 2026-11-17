import backendRequest from "./backendRequest";

export default async function updateRental(
  token: string,
  id: string,
  input: RentalInput
) {
  return await backendRequest<RentalItem>(`/rentals/${id}`, {
    method: "PUT",
    token,
    body: input,
  });
}
