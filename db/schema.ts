import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/** Single-row brand/business settings (id is always 1). */
export const brand = sqliteTable('brand', {
  id: integer('id').primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  tagAr: text('tag_ar').notNull().default(''),
  tagEn: text('tag_en').notNull().default(''),
  cityAr: text('city_ar').notNull().default(''),
  cityEn: text('city_en').notNull().default(''),
  currencyAr: text('currency_ar').notNull().default('د.ع'),
  currencyEn: text('currency_en').notNull().default('IQD'),
  facebook: text('facebook').notNull().default(''),
  instagram: text('instagram').notNull().default(''),
  phone: text('phone').notNull().default(''),
})

/** Menu "acts" / chapters that group categories (Savory, Bakery, Sweets, Drinks). */
export const acts = sqliteTable('acts', {
  id: text('id').primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  taglineAr: text('tagline_ar').notNull().default(''),
  taglineEn: text('tagline_en').notNull().default(''),
  sort: integer('sort').notNull().default(0),
})

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull().default(''),
  emoji: text('emoji').notNull().default(''),
  actId: text('act_id').references(() => acts.id, { onDelete: 'set null' }),
  sort: integer('sort').notNull().default(0),
})

export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  categoryId: text('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull().default(''),
  descAr: text('desc_ar').notNull().default(''),
  descEn: text('desc_en').notNull().default(''),
  price: integer('price').notNull().default(0),
  img: text('img').notNull().default(''),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  available: integer('available', { mode: 'boolean' }).notNull().default(true),
  sort: integer('sort').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const branches = sqliteTable('branches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull().default(''),
  hoursAr: text('hours_ar').notNull().default(''),
  hoursEn: text('hours_en').notNull().default(''),
  isNew: integer('is_new', { mode: 'boolean' }).notNull().default(false),
  sort: integer('sort').notNull().default(0),
})

/** Editable UI strings (the i18n layer), keyed by string id. */
export const uiStrings = sqliteTable('ui_strings', {
  key: text('key').primaryKey(),
  ar: text('ar').notNull().default(''),
  en: text('en').notNull().default(''),
})

export type BrandRow = typeof brand.$inferSelect
export type ActRow = typeof acts.$inferSelect
export type CategoryRow = typeof categories.$inferSelect
export type ItemRow = typeof items.$inferSelect
export type NewItemRow = typeof items.$inferInsert
export type BranchRow = typeof branches.$inferSelect
export type UiStringRow = typeof uiStrings.$inferSelect
