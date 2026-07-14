export type EquipmentCategory = 'ball' | 'racket' | 'indoor' | 'outdoor' | 'other';

export type EquipmentStatus = 'available' | 'reserved' | 'borrowed' | 'maintenance';

export interface Equipment {
  id: string;
  name: string;
  thaiName: string;
  category: EquipmentCategory;
  totalStock: number;
  availableStock: number;
  status: EquipmentStatus;
  location: string;
  description: string;
  icon: string;
}

export type BookingStatus = 'pending' | 'approved' | 'active' | 'returned' | 'rejected';

export interface Booking {
  id: string;
  studentName: string;
  studentId: string;
  department: string;
  equipmentId: string;
  equipmentName: string;
  quantity: number;
  borrowTime: string;
  returnTime: string;
  status: BookingStatus;
  ticketCode: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'booking' | 'borrow' | 'return' | 'maintenance' | 'system';
}

export interface User {
  name: string;
  id: string;
  role: 'student' | 'staff';
  department?: string;
}

