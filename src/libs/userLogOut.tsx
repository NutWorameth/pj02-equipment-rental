export default async function userLogOut(token: string) {
  await fetch(`${process.env.BACKEND_URL}/api/v1/auth/logout`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}
