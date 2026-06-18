import type { Lang } from '@/lib/types'

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

export const DEFAULT_STRINGS: Record<Lang, Strings> = {
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

/** Ordered keys + human labels, for the dashboard "UI strings" editor. */
export const STRING_KEYS: { key: keyof Strings; label: string }[] = [
  { key: 'enter', label: 'Loader: enter button' },
  { key: 'loading', label: 'Loader: loading text' },
  { key: 'exploreMenu', label: 'Hero: explore menu' },
  { key: 'scrollHint', label: 'Hero: scroll hint' },
  { key: 'established', label: 'Hero: established tagline' },
  { key: 'signatures', label: 'Featured: title' },
  { key: 'signaturesSub', label: 'Featured: subtitle' },
  { key: 'ourMenu', label: 'Menu: section title' },
  { key: 'categories', label: 'Nav: categories label' },
  { key: 'items', label: 'Count: items (plural)' },
  { key: 'item', label: 'Count: item (singular)' },
  { key: 'search', label: 'Search: label' },
  { key: 'searchPlaceholder', label: 'Search: placeholder' },
  { key: 'searchHint', label: 'Search: hint' },
  { key: 'noResults', label: 'Search: no results' },
  { key: 'noResultsSub', label: 'Search: no results sub' },
  { key: 'results', label: 'Search: results word' },
  { key: 'clear', label: 'Search: clear button' },
  { key: 'close', label: 'Dialog: close' },
  { key: 'ingredients', label: 'Item: ingredients label' },
  { key: 'startingAt', label: 'Item: starting-at price prefix' },
  { key: 'backToTop', label: 'Footer: back to top' },
  { key: 'visitUs', label: 'Footer: visit us' },
  { key: 'followUs', label: 'Footer: follow us' },
  { key: 'hours', label: 'Footer: opening hours label' },
  { key: 'hoursValue', label: 'Footer: opening hours value' },
  { key: 'freshDaily', label: 'Footer: fresh daily' },
  { key: 'madeWith', label: 'Footer: made-with note' },
  { key: 'allRights', label: 'Footer: rights reserved' },
  { key: 'langName', label: 'Toggle: current language name' },
  { key: 'switchTo', label: 'Toggle: switch-to label' },
  { key: 'viewItem', label: 'Card: view item (a11y)' },
  { key: 'priceNote', label: 'Menu: price note' },
]
