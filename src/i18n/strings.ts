import type { Lang } from '../data/menu'

export interface Strings {
  enter: string
  loading: string
  exploreMenu: string
  scrollHint: string
  established: string
  signatures: string
  signaturesSub: string
  ourMenu: string
  categories: string
  items: string
  item: string
  search: string
  searchPlaceholder: string
  searchHint: string
  noResults: string
  noResultsSub: string
  results: string
  clear: string
  close: string
  ingredients: string
  startingAt: string
  backToTop: string
  visitUs: string
  followUs: string
  hours: string
  hoursValue: string
  freshDaily: string
  madeWith: string
  allRights: string
  langName: string
  switchTo: string
  viewItem: string
  priceNote: string
}

export const STRINGS: Record<Lang, Strings> = {
  ar: {
    enter: 'ادخل المنيو',
    loading: 'نُحمّي الفرن…',
    exploreMenu: 'تصفّح المنيو',
    scrollHint: 'مرّر للأسفل',
    established: 'طازج كل يوم',
    signatures: 'أصنافنا المميّزة',
    signaturesSub: 'مختارات الشيف من المخبز',
    ourMenu: 'قائمة الطعام',
    categories: 'الأقسام',
    items: 'صنف',
    item: 'صنف',
    search: 'بحث',
    searchPlaceholder: 'ابحث عن منقوشة، كيك، قهوة…',
    searchHint: 'اكتب اسم الصنف أو المكوّن',
    noResults: 'لا توجد نتائج',
    noResultsSub: 'جرّب كلمة أخرى',
    results: 'نتيجة',
    clear: 'مسح',
    close: 'إغلاق',
    ingredients: 'المكوّنات',
    startingAt: 'يبدأ من',
    backToTop: 'إلى الأعلى',
    visitUs: 'زورونا',
    followUs: 'تابعونا',
    hours: 'أوقات العمل',
    hoursValue: 'يومياً · ٧ صباحاً – ١٢ منتصف الليل',
    freshDaily: 'يُخبز طازجاً كل صباح',
    madeWith: 'صُنع بحب في البصرة',
    allRights: 'جميع الحقوق محفوظة',
    langName: 'العربية',
    switchTo: 'English',
    viewItem: 'عرض الصنف',
    priceNote: 'الأسعار بالدينار العراقي',
  },
  en: {
    enter: 'Enter Menu',
    loading: 'Warming the oven…',
    exploreMenu: 'Explore the Menu',
    scrollHint: 'Scroll',
    established: 'Freshly baked, every day',
    signatures: 'Our Signatures',
    signaturesSub: "The baker's favourites",
    ourMenu: 'The Menu',
    categories: 'Categories',
    items: 'items',
    item: 'item',
    search: 'Search',
    searchPlaceholder: 'Search manoushe, cake, coffee…',
    searchHint: 'Type a dish or an ingredient',
    noResults: 'Nothing found',
    noResultsSub: 'Try a different word',
    results: 'results',
    clear: 'Clear',
    close: 'Close',
    ingredients: 'Ingredients',
    startingAt: 'from',
    backToTop: 'Back to top',
    visitUs: 'Visit us',
    followUs: 'Follow us',
    hours: 'Opening hours',
    hoursValue: 'Daily · 7 AM – 12 Midnight',
    freshDaily: 'Baked fresh every morning',
    madeWith: 'Made with love in Basra',
    allRights: 'All rights reserved',
    langName: 'English',
    switchTo: 'العربية',
    viewItem: 'View item',
    priceNote: 'Prices in Iraqi Dinar',
  },
}
