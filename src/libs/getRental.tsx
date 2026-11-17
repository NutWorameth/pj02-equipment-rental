import backendRequest from "./backendRequest";

export default async function getRental(token: string, id: string) {
  return await backendRequest<RentalItem>(`/rentals/${id}`, { token });
}
