import backendRequest from "./backendRequest";

export default async function createRental(token: string, input: RentalInput) {
  return await backendRequest<RentalItem>("/rentals", {
    method: "POST",
    token,
    body: input,
  });
}
