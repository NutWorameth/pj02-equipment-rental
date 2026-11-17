"use server";

import registerUser from "@/libs/registerUser";

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const result = await registerUser({
    name: input.name,
    email: input.email,
    tel: input.tel,
    role: input.role === "admin" ? "admin" : "member",
    password: input.password,
  });

  if (!result.ok) {
    return {
      error:
        result.error === "DUPLICATE"
          ? "This email is already registered. Sign in instead, or use another email."
          : result.error,
    };
  }

  return { error: null };
}
