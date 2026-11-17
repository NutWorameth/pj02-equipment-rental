export type RegisterFormValues = {
  name: string;
  email: string;
  tel: string;
  role: string;
  password: string;
};

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_PATTERN = /^\d{9,10}$/;

export function validateRegister(values: RegisterFormValues) {
  const errors: RegisterFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address, such as name@example.com.";
  }

  if (!TEL_PATTERN.test(values.tel.trim())) {
    errors.tel = "Enter 9 or 10 digits, numbers only.";
  }

  if (values.role !== "member" && values.role !== "admin") {
    errors.role = "Choose a role.";
  }

  if (values.password.length < 6) {
    errors.password = "Use at least 6 characters.";
  }

  return errors;
}
