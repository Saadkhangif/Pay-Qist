import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address.');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128)
  .regex(/[A-Za-z]/, 'Password must include a letter.')
  .regex(/[0-9]/, 'Password must include a number.');

const cnicSchema = z
  .string()
  .trim()
  .regex(/^\d{5}-?\d{7}-?\d$/, 'Enter a valid CNIC (e.g. 12345-1234567-1).');

const phoneSchema = z
  .string()
  .trim()
  .regex(/^03\d{2}-?\d{7}$/, 'Enter a valid phone number (e.g. 0337-3338633).');

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.').max(128),
});

export const signupFormSchema = z
  .object({
    cnic: cnicSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const profileFormSchema = z
  .object({
    cnic: cnicSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export function validateAuthForm(mode, values) {
  const schema =
    mode === 'signup' ? signupFormSchema : mode === 'profile' ? profileFormSchema : loginFormSchema;
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
