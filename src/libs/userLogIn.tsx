export default async function userLogIn(
  userEmail: string,
  userPassword: string
): Promise<AuthUser | null> {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    }
  );

  if (response.status === 400 || response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("ServerUnavailable");
  }

  const json = await response.json();
  return json.data;
}
