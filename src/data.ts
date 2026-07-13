import { Equipment, ActivityLog } from './types';

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Football',
    thaiName: 'ลูกฟุตบอล เบอร์ 5',
    category: 'ball',
    totalStock: 6,
    availableStock: 2,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ A - ชั้น 2',
    description: 'ลูกฟุตบอลหนังเย็บ PU ทนทานสูง สำหรับสนามหญ้าและสนามดิน',
    icon: 'Activity'
  },
  {
    id: 'eq-2',
    name: 'Badminton Racket',
    thaiName: 'ไม้แบดมินตัน',
    category: 'racket',
    totalStock: 12,
    availableStock: 8,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ B - ตะกร้าซ้าย',
    description: 'ไม้แบดน้ำหนักเบา เฟรมคาร์บอนไฟเบอร์ ควบคุมทิศทางได้แม่นยำ',
    icon: 'Sword'
  },
  {
    id: 'eq-3',
    name: 'Volleyball',
    thaiName: 'ลูกวอลเลย์บอล',
    category: 'ball',
    totalStock: 4,
    availableStock: 1,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ A - ชั้น 3',
    description: 'ลูกวอลเลย์บอลรุ่นแข่งขัน หนังนุ่มสัมผัสเยี่ยม ไม่เจ็บแขน',
    icon: 'Disc'
  },
  {
    id: 'eq-4',
    name: 'Futsal Ball',
    thaiName: 'ลูกฟุตซอล',
    category: 'ball',
    totalStock: 4,
    availableStock: 3,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ A - ชั้น 2',
    description: 'ลูกฟุตซอลเบอร์ 3.5 แรงกระดอนต่ำ เหมาะกับพื้นปูนใบพัดสโมฯ',
    icon: 'Compass'
  },
  {
    id: 'eq-5',
    name: 'Sepak Takraw Ball',
    thaiName: 'ลูกตะกร้อ',
    category: 'outdoor',
    totalStock: 8,
    availableStock: 6,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ B - ชั้นล่าง',
    description: 'ลูกตะกร้อใยสังเคราะห์สำหรับแข่งขันและฝึกซ้อม มีความยืดหยุ่นและการสปริงตัวที่ดีเยี่ยม',
    icon: 'Takraw'
  },
  {
    id: 'eq-6',
    name: 'Petanque Balls Set (3 Balls)',
    thaiName: 'ชุดลูกเปตอง (3 ลูก/ชุด)',
    category: 'outdoor',
    totalStock: 6,
    availableStock: 3,
    status: 'available',
    location: 'กล่องเหล็กมุมห้องสโมฯ',
    description: 'ลูกเปตองชุบโครเมี่ยมลายเส้นมาตรฐาน พร้อมลูกแก่นและเชือกวัดระยะ',
    icon: 'Target'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '10:15 น.',
    message: 'สมชาย (วิทย์-คอม) ยืม ลูกตะกร้อ 1 ลูก',
    type: 'borrow'
  },
  {
    id: 'log-2',
    timestamp: '10:30 น.',
    message: 'กัญญาวีร์ (วิทย์-เคมี) จอง ไม้แบดมินตัน 2 ไม้ ช่วงเย็นวันนี้',
    type: 'booking'
  },
  {
    id: 'log-3',
    timestamp: '11:00 น.',
    message: 'สตาฟฟ์ห้องสโมฯ นำ ลูกฟุตซอล เข้าสู่สถานะส่งซ่อมบำรุง',
    type: 'maintenance'
  },
  {
    id: 'log-4',
    timestamp: '11:15 น.',
    message: 'พีรพล (ฟิสิกส์) คืน ลูกฟุตบอล 1 ลูก เรียบร้อยแล้ว',
    type: 'return'
  }
];

export const DEPARTMENTS = [
  'การจัดการเทคโนโลยีการเกษตรและบริหารทรัพยากรชุมชน ',
  'สาขาวิชาสาธารณสุขศาสตร์ ',
  'สาขาวิชาการประกอบอาหารและการบริการอาหาร ',
  'คณิตศาสตร์',
  'เทคโนโลยีสารสนเทศ',
  'วิทยาการคอมพิวเตอร์',
  'สาขาวิชาเทคโนโลยีอาหารและความเป็นผู้ประกอบการสมัยใหม่',
  'การจัดการสิ่งแวดล้อมและทรัพยากรธรรมชาติ',
  'วิทยาศาสตร์เครื่องสำอาง',
  'คอมพิวเตอร์แอนิเมชันและมัลติมีเดีย',
  'การแพทย์แผนไทยประยุกต์',
  'เทคโนโลยีการเกษตรสมัยใหม่',
  'เทคโนโลยีผลิตภัณฑ์ชีวภาพกับการประกอบธุรกิจ',
];
