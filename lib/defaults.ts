/**
 * Default acts (chapters) and branches. Shared by the DB seed (`db/seed.ts`)
 * and the menu-data fallback (`lib/menu-data.ts`) so both stay in sync.
 */

export interface ActDefault {
  id: string
  nameAr: string
  nameEn: string
  taglineAr: string
  taglineEn: string
  categoryIds: string[]
}

export const ACTS_DEFAULT: ActDefault[] = [
  {
    id: 'savory',
    nameAr: 'المالح',
    nameEn: 'Savory',
    taglineAr: 'دافئٌ، خارجٌ للتوّ من الفرن',
    taglineEn: 'Warm, straight from the oven',
    categoryIds: ['manakish', 'manoushe-snacks', 'sandwiches', 'pastries', 'large-pastries', 'bida'],
  },
  {
    id: 'bakery',
    nameAr: 'المخبوزات',
    nameEn: 'Bakery & Bread',
    taglineAr: 'يُخبز طازجاً كلّ فجر',
    taglineEn: 'Baked fresh at every dawn',
    categoryIds: ['croissants', 'mini-croissants', 'kaak', 'breads', 'healthy-bakes'],
  },
  {
    id: 'sweet',
    nameAr: 'الحلويات',
    nameEn: 'Sweets',
    taglineAr: 'لكلّ لحظةٍ حلوة',
    taglineEn: 'For every sweet moment',
    categoryIds: [
      'donuts', 'cakes', 'whole-cakes', 'brownies', 'sponge-cake',
      'muffins', 'cream-muffins', 'cheesecake', 'arabic-sweets', 'petit-four',
    ],
  },
  {
    id: 'drinks',
    nameAr: 'المشروبات',
    nameEn: 'Drinks',
    taglineAr: 'ساخنة، مثلّجة، ومنعشة',
    taglineEn: 'Hot, iced & refreshing',
    categoryIds: ['hot-drinks', 'mojito', 'iced-drinks', 'milkshakes', 'smoothies', 'frappuccino', 'fresh-juices'],
  },
]

export interface BranchDefault {
  nameAr: string
  nameEn: string
  hoursAr: string
  hoursEn: string
  isNew: boolean
  sort: number
}

export const BRANCHES_DEFAULT: BranchDefault[] = [
  {
    nameAr: 'البصرة · شارع الجزائر',
    nameEn: 'Basra · Algeria St.',
    hoursAr: 'يومياً ٧ ص – ١٢ منتصف الليل',
    hoursEn: 'Daily 7 AM – 12 AM',
    isNew: false,
    sort: 0,
  },
  {
    nameAr: 'البصرة · العشار',
    nameEn: 'Basra · Al-Ashar',
    hoursAr: 'يومياً ٧ ص – ١٢ منتصف الليل',
    hoursEn: 'Daily 7 AM – 12 AM',
    isNew: true,
    sort: 1,
  },
]
