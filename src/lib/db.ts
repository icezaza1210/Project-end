import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Equipment, Booking, ActivityLog, User } from '../types';
import { INITIAL_EQUIPMENT, INITIAL_LOGS } from '../data';

// Collections
export const usersCol = collection(db, 'users');
export const equipmentCol = collection(db, 'equipment');
export const bookingsCol = collection(db, 'bookings');
export const logsCol = collection(db, 'logs');

// Seed Database if empty
export const seedDatabase = async () => {
  const eqSnap = await getDocs(equipmentCol);
  if (eqSnap.empty) {
    const batch = writeBatch(db);
    INITIAL_EQUIPMENT.forEach(eq => {
      batch.set(doc(equipmentCol, eq.id), eq);
    });
    
    INITIAL_LOGS.forEach(log => {
      batch.set(doc(logsCol, log.id), log);
    });

    batch.set(doc(usersCol, '660510999'), { id: '660510999', name: 'ณัฐพงษ์ ยอดวิทยา', role: 'student', department: 'วิทยาการคอมพิวเตอร์', penaltyPoints: 0, isBlacklisted: false });
    batch.set(doc(usersCol, 'STAFF-MAIN'), { id: 'STAFF-MAIN', name: 'สตาฟฟ์สโมสรฯ', role: 'staff', department: 'ส่วนกลาง', penaltyPoints: 0, isBlacklisted: false });

    await batch.commit();
  }
};

// Listeners
export const listenEquipment = (cb: (data: Equipment[]) => void) => {
  return onSnapshot(equipmentCol, (snap) => {
    cb(snap.docs.map(d => d.data() as Equipment));
  });
};

export const listenBookings = (cb: (data: Booking[]) => void) => {
  return onSnapshot(bookingsCol, (snap) => {
    const list = snap.docs.map(d => d.data() as Booking);
    list.sort((a, b) => {
      const numA = parseInt(a.id.replace(/[^0-9]/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/[^0-9]/g, ''), 10) || 0;
      if (numA !== numB) return numB - numA;
      return b.id.localeCompare(a.id);
    });
    cb(list);
  });
};

export const listenLogs = (cb: (data: ActivityLog[]) => void) => {
  return onSnapshot(logsCol, (snap) => {
    cb(snap.docs.map(d => d.data() as ActivityLog).sort((a, b) => b.id.localeCompare(a.id))); // rough sort by id which has timestamp
  });
};

export const listenUsers = (cb: (data: Record<string, User>) => void) => {
  return onSnapshot(usersCol, (snap) => {
    const users: Record<string, User> = {};
    snap.docs.forEach(d => {
      users[d.id] = d.data() as User;
    });
    cb(users);
  });
};

// Mutations
export const pushLogDb = async (message: string, type: ActivityLog['type']) => {
  const time = new Date();
  const timestampStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')} น.`;
  const id = `log-${Date.now()}`;
  await setDoc(doc(logsCol, id), { id, timestamp: timestampStr, message, type });
};

export const updateBookingDb = async (id: string, data: Partial<Booking>) => {
  await updateDoc(doc(bookingsCol, id), data);
};

export const addBookingDb = async (booking: Booking) => {
  await setDoc(doc(bookingsCol, booking.id), booking);
};

export const deleteBookingDb = async (id: string) => {
  await deleteDoc(doc(bookingsCol, id));
};

export const updateEquipmentDb = async (id: string, data: Partial<Equipment>) => {
  await updateDoc(doc(equipmentCol, id), data);
};

export const updateUserDb = async (id: string, data: Partial<User>) => {
  await updateDoc(doc(usersCol, id), data);
};

export const addUserDb = async (user: User) => {
  await setDoc(doc(usersCol, user.id), user);
};
