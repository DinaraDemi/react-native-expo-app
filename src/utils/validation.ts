import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Za-z]/, "Password must contain at least one letter and one number.")
    .regex(/\d/, "Password must contain at least one letter and one number."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type FormErrors<T> = Partial<Record<keyof T, string>>;

const firstError = (schema: z.ZodType<string>, value: string): string | undefined => {
  const result = schema.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateEmail = (email: string): string | undefined =>
  firstError(loginSchema.shape.email, email);

export const validatePassword = (password: string): string | undefined =>
  firstError(loginSchema.shape.password, password);

export const validateLoginForm = (values: LoginFormValues): FormErrors<LoginFormValues> => {
  const result = loginSchema.safeParse(values);
  if (result.success) return {};

  const errors: FormErrors<LoginFormValues> = {};
  for (const issue of result.error.issues) {
    const [field] = issue.path;
    if (typeof field === "string") {
      const key = field as keyof LoginFormValues;
      if (!errors[key]) errors[key] = issue.message;
    }
  }
  return errors;
};

export const hasErrors = (errors: FormErrors<LoginFormValues>): boolean =>
  Object.values(errors).some(Boolean);
