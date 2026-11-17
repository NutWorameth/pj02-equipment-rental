import backendRequest from "./backendRequest";

export default async function getRentals(token: string) {
  return await backendRequest<RentalItem[]>("/rentals", { token });
}
