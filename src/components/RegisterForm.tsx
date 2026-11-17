"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/actions/authActions";
import {
  validateRegister,
  type RegisterFormErrors,
  type RegisterFormValues,
} from "@/libs/registerRules";

const emptyValues: RegisterFormValues = {
  name: "",
  email: "",
  tel: "",
  role: "member",
  password: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterFormValues>(emptyValues);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const setField = (field: keyof RegisterFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);

    const result = await registerAction({
      name: values.name.trim(),
      email: values.email.trim(),
      tel: values.tel.trim(),
      role: values.role === "admin" ? "admin" : "member",
      password: values.password,
    });

    if (result.error) {
      setPending(false);
      setFormError(result.error);
      return;
    }

    router.push("/signin?registered=1");
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      noValidate
      className="card flex flex-col gap-[18px] p-8"
    >
      <h1 className="font-display text-[28px] font-bold leading-tight">
        Create your account
      </h1>

      {formError ? (
        <div role="alert" className="alert-error">
          {formError}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-name" className="field-label">
          Name
        </label>
        <input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "register-name-error" : undefined}
          className={`field-input ${errors.name ? "field-input-error" : ""}`}
        />
        {errors.name ? (
          <div id="register-name-error" className="field-error">
            {errors.name}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-email" className="field-label">
          Email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "register-email-error" : undefined}
          className={`field-input ${errors.email ? "field-input-error" : ""}`}
        />
        {errors.email ? (
          <div id="register-email-error" className="field-error">
            {errors.email}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-tel" className="field-label">
          Telephone
        </label>
        <input
          id="register-tel"
          name="tel"
          type="tel"
          autoComplete="tel"
          value={values.tel}
          onChange={(event) => setField("tel", event.target.value)}
          aria-invalid={errors.tel ? true : undefined}
          aria-describedby={errors.tel ? "register-tel-error" : "register-tel-hint"}
          className={`field-input ${errors.tel ? "field-input-error" : ""}`}
        />
        {errors.tel ? (
          <div id="register-tel-error" className="field-error">
            {errors.tel}
          </div>
        ) : (
          <div id="register-tel-hint" className="field-hint">
            9 or 10 digits, numbers only.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-role" className="field-label">
          Role
        </label>
        <select
          id="register-role"
          name="role"
          value={values.role}
          onChange={(event) => setField("role", event.target.value)}
          className="field-input"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-password" className="field-label">
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(event) => setField("password", event.target.value)}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={
            errors.password ? "register-password-error" : "register-password-hint"
          }
          className={`field-input ${errors.password ? "field-input-error" : ""}`}
        />
        {errors.password ? (
          <div id="register-password-error" className="field-error">
            {errors.password}
          </div>
        ) : (
          <div id="register-password-hint" className="field-hint">
            At least 6 characters.
          </div>
        )}
      </div>

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Creating account..." : "Create account"}
      </button>

      <div className="text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="text-accent hover:text-accent-dark">
          Sign in
        </Link>
      </div>
    </form>
  );
}
