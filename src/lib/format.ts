export const formatBookingDateTime = (str?: string) => {
  if (!str) return '';
  // Check if string already contains a date (slashes, dashes, or Thai month names)
  if (
    str.includes('/') ||
    str.includes('-') ||
    /[ก-ฮ]/.test(str) && (
      str.includes('ก.ค.') || str.includes('ม.ค.') || str.includes('ก.พ.') ||
      str.includes('มี.ค.') || str.includes('เม.ย.') || str.includes('พ.ค.') ||
      str.includes('มิ.ย.') || str.includes('ส.ค.') || str.includes('ก.ย.') ||
      str.includes('ต.ค.') || str.includes('พ.ย.') || str.includes('ธ.ค.')
    )
  ) {
    return str;
  }

  // If str is a pure time e.g. "17:19:56" or "16:27:02" or "10:15"
  const today = new Date();
  const thaiDate = today.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return `${thaiDate} ${str}`;
};
