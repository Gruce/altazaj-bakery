import { z } from 'zod'

const optionalText = z.string().trim().default('')

export const itemSchema = z.object({
  id: z.string().trim().optional(),
  categoryId: z.string().trim().min(1, 'Category is required'),
  nameAr: z.string().trim().min(1, 'Arabic name is required'),
  nameEn: optionalText,
  descAr: optionalText,
  descEn: optionalText,
  price: z.coerce.number().int('Whole numbers only').min(0).default(0),
  img: optionalText,
  featured: z.boolean().default(false),
  available: z.boolean().default(true),
})
export type ItemInput = z.infer<typeof itemSchema>

export const categorySchema = z.object({
  id: z.string().trim().optional(),
  nameAr: z.string().trim().min(1, 'Arabic name is required'),
  nameEn: optionalText,
  emoji: optionalText,
  actId: z.string().trim().nullable().default(null),
})
export type CategoryInput = z.infer<typeof categorySchema>

export const actSchema = z.object({
  id: z.string().trim().optional(),
  nameAr: z.string().trim().min(1, 'Arabic name is required'),
  nameEn: optionalText,
  taglineAr: optionalText,
  taglineEn: optionalText,
})
export type ActInput = z.infer<typeof actSchema>

export const branchSchema = z.object({
  id: z.coerce.number().int().optional(),
  nameAr: z.string().trim().min(1, 'Arabic name is required'),
  nameEn: optionalText,
  hoursAr: optionalText,
  hoursEn: optionalText,
  isNew: z.boolean().default(false),
})
export type BranchInput = z.infer<typeof branchSchema>

export const brandSchema = z.object({
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  tagAr: optionalText,
  tagEn: optionalText,
  cityAr: optionalText,
  cityEn: optionalText,
  currencyAr: z.string().trim().min(1),
  currencyEn: z.string().trim().min(1),
  facebook: optionalText,
  instagram: optionalText,
  phone: optionalText,
})
export type BrandInput = z.infer<typeof brandSchema>

export const stringRowSchema = z.object({
  key: z.string().trim().min(1),
  ar: z.string().default(''),
  en: z.string().default(''),
})
export const stringsSchema = z.object({
  strings: z.array(stringRowSchema),
})
export type StringsInput = z.infer<typeof stringsSchema>
