import { z } from 'zod';

const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address.');

const cnicSchema = z
  .string()
  .trim()
  .regex(/^\d{5}-?\d{7}-?\d$/, 'Enter a valid CNIC (e.g. 12345-1234567-1).');

const phoneSchema = z
  .string()
  .trim()
  .regex(/^03\d{2}-?\d{7}$/, 'Enter a valid phone number (e.g. 0337-3338633).');

const imageSchema = z
  .string()
  .min(1, 'Please upload an image.')
  .max(2_000_000)
  .refine((value) => value.startsWith('data:image/'), 'Please upload a valid image file.');

const personFieldsSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required.').max(80),
  phone: phoneSchema,
});

export const applicantSchema = personFieldsSchema.extend({
  cnic: cnicSchema,
  email: emailSchema,
  occupation: z.string().trim().min(2, 'Occupation is required.').max(80),
  school: z.string().trim().min(2, 'School is required.').max(120),
  photo: imageSchema,
  idFront: imageSchema,
  idBack: imageSchema,
});

export const referralSchema = personFieldsSchema.extend({
  photo: imageSchema,
  idFront: imageSchema,
  idBack: imageSchema,
});

export const applicationFormSchema = z.object({
  applicant: applicantSchema,
  referral: referralSchema,
});

export function validateApplicationForm(values) {
  const result = applicationFormSchema.safeParse(values);

  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || 'Invalid input.' };
  }

  return { success: true, data: result.data };
}
