import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address.');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128)
  .regex(/[A-Za-z]/, 'Password must include a letter.')
  .regex(/[0-9]/, 'Password must include a number.');

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.').max(128),
});

export const signupFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80),
  email: emailSchema,
  password: passwordSchema,
});

export function validateAuthForm(mode, values) {
  const schema = mode === 'signup' ? signupFormSchema : loginFormSchema;
  const result = schema.safeParse(values);

  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || 'Invalid input.' };
  }

  return { success: true, data: result.data };
}

export function sanitizeText(value, maxLength = 500) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}
