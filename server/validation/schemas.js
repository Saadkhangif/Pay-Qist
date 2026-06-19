import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().email().max(254);
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128)
  .regex(/[A-Za-z]/, 'Password must include a letter.')
  .regex(/[0-9]/, 'Password must include a number.');

export const signupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required.').max(128),
});

export const roleUpdateSchema = z.object({
  role: z.enum(['admin', 'customer']),
});

export const productSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  price: z.coerce.number().positive().max(100_000_000),
  category: z.string().trim().min(2).max(60).optional(),
  imageUrl: z.string().url().max(500).optional().or(z.literal('')),
  featured: z.boolean().optional(),
  allowedInstallmentMonths: z.array(z.coerce.number().int().positive()).max(6).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80),
  email: emailSchema,
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(2000),
});

export const checkoutSchema = z.object({
  cart: z
    .array(
      z.object({
        productId: z.string().trim().min(1).max(128),
        quantity: z.coerce.number().int().positive().max(99),
        installmentMonths: z.coerce.number().int().positive().max(60).optional(),
      }),
    )
    .min(1)
    .max(50),
  paymentMethod: z.enum(['card', 'bank', 'wallet']).optional(),
  paymentReference: z.string().trim().max(120).optional(),
});

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((issue) => issue.message).join(' ');
      return res.status(400).json({ error: message });
    }
    req.body = result.data;
    return next();
  };
}
