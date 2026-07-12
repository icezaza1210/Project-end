import { Equipment, ActivityLog } from './types';

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Basketball Spaulding',
    thaiName: 'ลูกบาสเกตบอล Spalding',
    category: 'ball',
    totalStock: 5,
    availableStock: 3,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ A - ชั้น 1',
    description: 'ลูกบาสเกตบอลหนังแท้เบอร์ 7 เหมาะสำหรับเล่นในสนามปูนและในร่ม',
    icon: 'Dribbble'
  },
  {
    id: 'eq-2',
    name: 'Molten Football',
    thaiName: 'ลูกฟุตบอล Molten เบอร์ 5',
    category: 'ball',
    totalStock: 6,
    availableStock: 2,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ A - ชั้น 2',
    description: 'ลูกฟุตบอลหนังเย็บ PU ทนทานสูง สำหรับสนามหญ้าและสนามดิน',
    icon: 'Activity'
  },
  {
    id: 'eq-3',
    name: 'Yonex Badminton Racket',
    thaiName: 'ไม้แบดมินตัน Yonex',
    category: 'racket',
    totalStock: 12,
    availableStock: 8,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ B - ตะกร้าซ้าย',
    description: 'ไม้แบดน้ำหนักเบา เฟรมคาร์บอนไฟเบอร์ ควบคุมทิศทางได้แม่นยำ',
    icon: 'Sword'
  },
  {
    id: 'eq-4',
    name: 'Table Tennis Set (2 Paddles)',
    thaiName: 'ชุดไม้ปิงปองแพ็คคู่ (พร้อมลูก)',
    category: 'indoor',
    totalStock: 8,
    availableStock: 5,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ B - ชั้น 3',
    description: 'ชุดไม้ปิงปอง 2 ไม้พร้อมลูกปิงปอง 3 ลูก ยางเด้งสปินดี',
    icon: 'Tablets'
  },
  {
    id: 'eq-5',
    name: 'Mikasa Volleyball',
    thaiName: 'ลูกวอลเลย์บอล Mikasa V200W',
    category: 'ball',
    totalStock: 4,
    availableStock: 1,
    status: 'available',
    location: 'ตู้เก็บอุปกรณ์ A - ชั้น 3',
    description: 'ลูกวอลเลย์บอลรุ่นแข่งขัน หนังนุ่มสัมผัสเยี่ยม ไม่เจ็บแขน',
    icon: 'Disc'
  },
  {
    id: 'eq-6',
    name: 'Futsal Ball Molten',
    thaiName: 'ลูกฟุตซอล Molten',
    category: 'ball',
    totalStock: 4,
    availableStock: 0,
    status: 'borrowed',
    location: 'ตู้เก็บอุปกรณ์ A - ชั้น 2',
    description: 'ลูกฟุตซอลเบอร์ 3.5 แรงกระดอนต่ำ เหมาะกับพื้นปูนใบพัดสโมฯ',
    icon: 'Compass'
  },
  {
    id: 'eq-7',
    name: 'Petanque Balls Set (3 Balls)',
    thaiName: 'ชุดลูกเปตอง (3 ลูก/ชุด)',
    category: 'outdoor',
    totalStock: 6,
    availableStock: 3,
    status: 'available',
    location: 'กล่องเหล็กมุมห้องสโมฯ',
    description: 'ลูกเปตองชุบโครเมี่ยมลายเส้นมาตรฐาน พร้อมลูกแก่นและเชือกวัดระยะ',
    icon: 'Target'
  },
  {
    id: 'eq-8',
    name: 'International Chess Board',
    thaiName: 'กระดานหมากรุกสากล',
    category: 'indoor',
    totalStock: 5,
    availableStock: 5,
    status: 'available',
    location: 'ชั้นวางบอร์ดเกม - ชั้น 1',
    description: 'กระดานไม้พับได้ พร้อมตัวหมากรุกไม้ลงรายละเอียดประณีต',
    icon: 'Grid'
  },
  {
    id: 'eq-9',
    name: 'Handball Star',
    thaiName: 'ลูกแฮนด์บอลเบอร์ 2',
    category: 'indoor',
    totalStock: 3,
    availableStock: 0,
    status: 'maintenance',
    location: 'ตู้เก็บอุปกรณ์ C - ชั้นล่าง',
    description: 'ลูกแฮนด์บอลผิวสัมผัสหนึบมือ กำลังส่งซ่อมรอยเย็บและจุกลมซึม',
    icon: 'LifeBuoy'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '10:15 น.',
    message: 'สมชาย (วิทย์-คอม) ยืม ลูกบาสเกตบอล Spalding 1 ลูก',
    type: 'borrow'
  },
  {
    id: 'log-2',
    timestamp: '10:30 น.',
    message: 'กัญญาวีร์ (วิทย์-เคมี) จอง ไม้แบดมินตัน Yonex 2 ไม้ ช่วงเย็นวันนี้',
    type: 'booking'
  },
  {
    id: 'log-3',
    timestamp: '11:00 น.',
    message: 'สตาฟฟ์ห้องสโมฯ นำ ลูกแฮนด์บอลเบอร์ 2 เข้าสู่สถานะส่งซ่อมบำรุง',
    type: 'maintenance'
  },
  {
    id: 'log-4',
    timestamp: '11:15 น.',
    message: 'พีรพล (ฟิสิกส์) คืน ลูกฟุตบอล Molten 1 ลูก เรียบร้อยแล้ว',
    type: 'return'
  }
];

export const DEPARTMENTS = [
  'วิทยาการคอมพิวเตอร์ (Computer Science)',
  'เทคโนโลยีสารสนเทศ (Information Technology)',
  'เคมี (Chemistry)',
  'ฟิสิกส์ (Physics)',
  'ชีววิทยา (Biology)',
  'คณิตศาสตร์และสถิติ (Mathematics & Statistics)',
  'วัสดุศาสตร์ (Materials Science)',
  'จุลชีววิทยา (Microbiology)',
  'วิทยาศาสตร์สิ่งแวดล้อม (Environmental Science)'
];
