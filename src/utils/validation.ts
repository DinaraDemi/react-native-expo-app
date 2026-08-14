export interface LoginFormValues {
  email: string;
  password: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address. Returns an error message or `undefined` when
 * the value is valid.
 */
export const validateEmail = (email: string): string | undefined => {
  const value = email.trim();
  if (!value) return "Email is required.";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";
  return undefined;
};

/**
 * Validates a password. Returns an error message or `undefined` when the
 * value is valid.
 */
export const validatePassword = (password: string): string | undefined => {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return undefined;
};

/**
 * Validates the whole login form and returns an errors map keyed by field.
 * Fields that pass validation map to `undefined`.
 */
export const validateLoginForm = (values: LoginFormValues): FormErrors<LoginFormValues> => ({
  email: validateEmail(values.email),
  password: validatePassword(values.password),
});

/** True when any field in the errors map has a message. */
export const hasErrors = (errors: FormErrors<LoginFormValues>): boolean =>
  Object.values(errors).some(Boolean);
