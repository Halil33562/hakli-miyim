export const CATEGORIES = [
  { key: 'tumu', label: 'Tümü', color: '#6E56CF', bg: '#F1EDFC' },
  { key: 'aile', label: 'Aile', color: '#C2670A', bg: '#FFF3E4' },
  { key: 'is', label: 'İş', color: '#1D5FC4', bg: '#EAF2FE' },
  { key: 'arkadaslik', label: 'Arkadaşlık', color: '#A87A05', bg: '#FEF6E0' },
  { key: 'iliski', label: 'İlişki', color: '#C23B82', bg: '#FDEBF4' },
  { key: 'para', label: 'Para', color: '#0F8F5F', bg: '#E7FBF3' },
  { key: 'diger', label: 'Diğer', color: '#6B6B7B', bg: '#F1F1F5' },
]

export function getCategory(key?: string) {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[CATEGORIES.length - 1]
}