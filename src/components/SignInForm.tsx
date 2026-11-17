"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

type SignInFormProps = {
  callbackUrl: string;
  notice?: string;
};

export default function SignInForm({ callbackUrl, notice }: SignInFormProps) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    setPending(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setPending(false);
      setError(
        result?.error === "CredentialsSignin"
          ? "Email or password is incorrect. Try again."
          : "Cannot reach the server right now. Try again in a moment."
      );
      return;
    }

    window.location.assign(callbackUrl);
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      noValidate
      className="card flex flex-col gap-[18px] p-8"
    >
      <h1 className="font-display text-[28px] font-bold leading-tight">
        Sign in
      </h1>

      {notice && !error ? (
        <div role="status" className="alert-info">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div role="alert" className="alert-error">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signin-email" className="field-label">
          Email
        </label>
        <input
          id="signin-email"
          name="email"
          type="email"
          autoComplete="email"
          className="field-input"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signin-password" className="field-label">
          Password
        </label>
        <input
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="field-input"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <div className="text-sm">
        No account yet?{" "}
        <Link href="/register" className="text-accent hover:text-accent-dark">
          Register
        </Link>
      </div>
    </form>
  );
}
