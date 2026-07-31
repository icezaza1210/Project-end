export const EQUIPMENT_IMAGES: Record<string, string> = {
  // By equipment ID
  'eq-1': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop', // Football
  'eq-2': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop', // Badminton
  'eq-3': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop', // Volleyball
  'eq-4': 'https://6319nophawanblog.wordpress.com/wp-content/uploads/2017/02/160923b4u11950.jpg', // Futsal
  'eq-5': 'https://library.sportingnews.com/styles/crop_style_16_9_desktop_webp/s3/2024-08/GettyImages-2154256230.jpg.webp?itok=2CsCO-Cm', // Takraw
  'eq-6': 'https://www.newsportolympic.com/wp-content/uploads/2021/02/shutterstock_1101388403-scaled.jpg', // Petanque
};

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  ball: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
  racket: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop',
  outdoor: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop',
  indoor: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
  other: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop',
};

export function getEquipmentImage(item?: { id?: string; name?: string; thaiName?: string; category?: string; image?: string } | null): string {
  if (!item) return CATEGORY_FALLBACK_IMAGES.other;
  if (item.id && EQUIPMENT_IMAGES[item.id]) return EQUIPMENT_IMAGES[item.id];
  if (item.image && item.image.trim() !== '') return item.image;
  
  const searchName = `${item.name || ''} ${item.thaiName || ''}`.toLowerCase();
  if (searchName.includes('ฟุตบอล') || searchName.includes('football')) return EQUIPMENT_IMAGES['eq-1'];
  if (searchName.includes('แบด') || searchName.includes('badminton')) return EQUIPMENT_IMAGES['eq-2'];
  if (searchName.includes('วอลเลย์') || searchName.includes('volleyball')) return EQUIPMENT_IMAGES['eq-3'];
  if (searchName.includes('ฟุตซอล') || searchName.includes('futsal')) return EQUIPMENT_IMAGES['eq-4'];
  if (searchName.includes('ตะกร้อ') || searchName.includes('takraw')) return EQUIPMENT_IMAGES['eq-5'];
  if (searchName.includes('เปตอง') || searchName.includes('petanque')) return EQUIPMENT_IMAGES['eq-6'];

  if (item.category && CATEGORY_FALLBACK_IMAGES[item.category]) {
    return CATEGORY_FALLBACK_IMAGES[item.category];
  }

  return CATEGORY_FALLBACK_IMAGES.other;
}
