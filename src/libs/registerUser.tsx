import backendRequest from "./backendRequest";

export default async function registerUser(input: RegisterInput) {
  return await backendRequest<AuthUser>("/auth/register", {
    method: "POST",
    body: input,
  });
}
