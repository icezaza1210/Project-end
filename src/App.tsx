import { seedDatabase, listenEquipment, listenBookings, listenLogs, listenUsers, pushLogDb, updateBookingDb, addBookingDb, deleteBookingDb, updateEquipmentDb, updateUserDb, addUserDb, addPenaltyLogDb, listenPenaltyLogs } from "./lib/db";
import { formatBookingDateTime } from "./lib/format";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_EQUIPMENT, INITIAL_LOGS } from './data';
import { Equipment, Booking, ActivityLog, User } from './types';
import EquipmentGrid from './components/EquipmentGrid';
import BookingForm from './components/BookingForm';
import LiveFeed from './components/LiveFeed';
import AdminPanel from './components/AdminPanel';
import LoginView from './components/LoginView';
import LandingView from './components/LandingView';
import SettingsModal from './components/SettingsModal';
import StudentProfile from './components/StudentProfile';
import HeroBanner from './components/HeroBanner';
import { useSettings } from './contexts/SettingsContext';
import { Trophy, Compass, ClipboardList, Shield, AlertCircle, Sparkles, LogOut, Lock, Settings, MessageCircle, X, Bell, Radio, Megaphone, Check, CheckCircle2, Info } from 'lucide-react';

export default function App() {
  const { t, setIsSettingsOpen, playPop } = useSettings();
  
  // Main states
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('sci_sports_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>(() => {
    try {
      const savedUser = localStorage.getItem('sci_sports_user');
      if (savedUser) return 'app';
      const savedMode = localStorage.getItem('sci_sports_view_mode');
      if (savedMode === 'landing' || savedMode === 'login' || savedMode === 'app') {
        return savedMode;
      }
    } catch (e) {}
    return 'landing';
  });

  // Sync session state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('sci_sports_user', JSON.stringify(user));
      localStorage.setItem('sci_sports_view_mode', 'app');
    } else {
      localStorage.removeItem('sci_sports_user');
      localStorage.setItem('sci_sports_view_mode', viewMode);
    }
  }, [user, viewMode]);
  
  // New States for Penalties & Issues
  const [usersDb, setUsersDb] = useState<Record<string, User>>({});
  const [penaltyLogs, setPenaltyLogs] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'booking' | 'admin' | 'profile'>('catalog');
  const [preselectedEq, setPreselectedEq] = useState<Equipment | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    seedDatabase();
    const unsubUsers = listenUsers(setUsersDb);
    const unsubPenaltyLogs = listenPenaltyLogs(setPenaltyLogs);
    const unsubEq = listenEquipment(setEquipment);
    const unsubBookings = listenBookings(setBookings);
    const unsubLogs = listenLogs(setLogs);
    
    return () => {
      clearInterval(timer);
      unsubUsers();
      unsubPenaltyLogs();
      unsubEq();
      unsubBookings();
      unsubLogs();
    };
  }, []);

  // Notifications Logic
  const getBookingAlerts = () => {
    let count = 0;
    const alertList: { id: string; type: 'danger' | 'warning' | 'success' | 'info'; name: string; msg: string; time?: string }[] = [];

    if (user?.role === 'staff') {
      const pendingBookings = bookings.filter(b => b.status === 'pending');
      count += pendingBookings.length;
      pendingBookings.forEach(b => {
        alertList.push({
          id: `pending-${b.id}`,
          type: 'warning',
          name: `รออนุมัติ: ${b.studentName}`,
          msg: `ยืม ${b.equipmentName} (${b.quantity} ชิ้น) • รหัสตั๋ว ${b.ticketCode}`,
          time: b.createdAt
        });
      });

      const issueReports = bookings.filter(b => b.issueReported && b.issueStatus === 'pending');
      count += issueReports.length;
      issueReports.forEach(b => {
        alertList.push({
          id: `issue-${b.id}`,
          type: 'danger',
          name: `รายงานปัญหาจาก ${b.studentName}`,
          msg: `${b.equipmentName}: ${b.issueDetails || 'ชำรุด/เสียหาย'}`,
          time: b.createdAt
        });
      });

      return { alerts: alertList, urgentCount: count };
    }

    // Student Notifications
    const userData = user ? (usersDb[user.id] || user) : null;

    if (userData?.isBlacklisted) {
      count++;
      alertList.push({
        id: 'user-blacklist',
        type: 'danger',
        name: 'แจ้งเตือนสถานะบัญชี',
        msg: 'บัญชีของคุณถูกระงับสิทธิ์การยืมอุปกรณ์ (Blacklisted)'
      });
    } else if ((userData?.penaltyPoints || 0) > 0) {
      alertList.push({
        id: 'user-penalty',
        type: 'warning',
        name: 'คะแนนความประพฤติ',
        msg: `คุณถูกหักคะแนนความประพฤติรวม ${userData?.penaltyPoints} คะแนน`
      });
    }

    const myBookings = bookings.filter(b => b.studentId === user?.id || (user?.id && b.studentId === user.id));

    myBookings.forEach(b => {
      if (b.status === 'approved') {
        count++;
        alertList.push({
          id: `approved-${b.id}`,
          type: 'success',
          name: `อนุมัติการจองแล้ว! (${b.equipmentName})`,
          msg: `รหัสตั๋ว ${b.ticketCode} • สตาฟฟ์อนุมัติคิวจองแล้ว สามารถมารับอุปกรณ์ได้ที่ห้องสโมสรฯ`,
          time: b.createdAt
        });
      } else if (b.status === 'rejected') {
        count++;
        alertList.push({
          id: `rejected-${b.id}`,
          type: 'danger',
          name: `คำขอจองถูกปฏิเสธ (${b.equipmentName})`,
          msg: `รหัสตั๋ว ${b.ticketCode} • สตาฟฟ์ไม่อนุมัติคิวจองนี้`,
          time: b.createdAt
        });
      } else if (b.status === 'active') {
        let isUrgent = false;
        let alertType: 'danger' | 'warning' | 'info' = 'info';
        let alertMsg = `รหัสตั๋ว ${b.ticketCode} • รับอุปกรณ์แล้ว กำลังใช้งาน`;

        if (b.returnTime && b.returnTime !== 'ไม่ระบุ') {
          try {
            const parts = b.returnTime.replace(/[^0-9:]/g, '').split(':');
            if (parts.length >= 2) {
              const retHour = parseInt(parts[0], 10);
              const retMin = parseInt(parts[1], 10);
              if (!isNaN(retHour) && !isNaN(retMin)) {
                const currHour = currentTime.getHours();
                const currMin = currentTime.getMinutes();
                const diff = (retHour * 60 + retMin) - (currHour * 60 + currMin);

                if (diff < 0) {
                  alertType = 'danger';
                  alertMsg = `เลยกำหนดคืน ${Math.abs(diff)} นาที! (รหัสตั๋ว ${b.ticketCode}) โปรดนำมาคืนทันที`;
                  isUrgent = true;
                } else if (diff <= 30) {
                  alertType = 'warning';
                  alertMsg = `เหลือเวลาอีก ${diff} นาทีจะครบกำหนดคืน (รหัสตั๋ว ${b.ticketCode})`;
                  isUrgent = true;
                } else {
                  alertType = 'info';
                  alertMsg = `รหัสตั๋ว ${b.ticketCode} • กำหนดคืนเวลา ${b.returnTime} น.`;
                }
              }
            }
          } catch (e) {}
        }

        if (isUrgent) count++;
        alertList.push({
          id: `active-${b.id}`,
          type: alertType,
          name: alertType === 'danger' ? `เลยกำหนดคืน! (${b.equipmentName})` : alertType === 'warning' ? `ใกล้ถึงกำหนดคืน (${b.equipmentName})` : `กำลังยืมใช้งาน (${b.equipmentName})`,
          msg: alertMsg,
          time: b.createdAt
        });
      } else if (b.status === 'pending') {
        alertList.push({
          id: `pending-${b.id}`,
          type: 'warning',
          name: `กำลังรอสตาฟฟ์อนุมัติ (${b.equipmentName})`,
          msg: `รหัสตั๋ว ${b.ticketCode} • ส่งคำขอจองแล้ว อยู่ระหว่างรอสตาฟฟ์ตรวจสอบ`,
          time: b.createdAt
        });
      }

      if (b.issueReported && b.issueStatus === 'resolved') {
        alertList.push({
          id: `resolved-${b.id}`,
          type: 'success',
          name: `รายงานปัญหาได้รับการแก้ไข`,
          msg: `รายงานอุปกรณ์ ${b.equipmentName} ได้รับการตรวจสอบและแก้ไขแล้ว`,
          time: b.createdAt
        });
      }
    });

    return { alerts: alertList, urgentCount: count };
  };

  const { alerts, urgentCount } = getBookingAlerts();
  const unreadAlerts = alerts.filter(al => !readNotificationIds.includes(al.id));
  const unreadCount = unreadAlerts.length;

  // Helper to push a new activity log
  const pushLog = (message: string, type: 'booking' | 'borrow' | 'return' | 'maintenance' | 'system') => {
    pushLogDb(message, type);
  };

  // 1. Submit online booking (Pending state)
  const handleReportIssue = (bookingId: string, details: string) => {
    updateBookingDb(bookingId, { issueReported: true, issueDetails: details, issueStatus: 'pending' });
    // Add log
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      pushLog(`${user?.name} รายงานปัญหา: ${details} (${booking.equipmentName})`, 'maintenance');
    }
  };

  const handleUpdateUserStatus = (userId: string, penaltyDelta: number, isBlacklisted: boolean, reason: string = '') => {
    const u = usersDb[userId] || { id: userId, name: 'Unknown', role: 'student', penaltyPoints: 0, isBlacklisted: false, suspendedUntil: 0 };
    
    let newPoints = Math.max(0, (u.penaltyPoints || 0) + penaltyDelta);
    let newBlacklisted = isBlacklisted;
    let newSuspendedUntil = u.suspendedUntil || 0;

    // Point-based rules
    if (!newBlacklisted) {
      if (newPoints >= 500) {
        newBlacklisted = true;
      } else if (newPoints >= 300) {
        newSuspendedUntil = Math.max(newSuspendedUntil, Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      } else if (newPoints >= 200) {
        newSuspendedUntil = Math.max(newSuspendedUntil, Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
      } else if (newPoints >= 100) {
        newSuspendedUntil = Math.max(newSuspendedUntil, Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      }
    }

    // Unban case
    if (penaltyDelta === 0 && !isBlacklisted && u.isBlacklisted) {
       newPoints = 0; // reset points on unban
       newSuspendedUntil = 0;
    }

    updateUserDb(userId, {
      penaltyPoints: newPoints,
      isBlacklisted: newBlacklisted,
      suspendedUntil: newSuspendedUntil
    });

    addPenaltyLogDb({
      id: `plog-${Date.now()}`,
      studentId: userId,
      adminId: user?.id || 'System',
      pointsAdded: penaltyDelta,
      reason,
      timestamp: new Date().toISOString(),
      actionTaken: isBlacklisted ? 'Immediate Blacklist' : (penaltyDelta === 0 && !isBlacklisted && u.isBlacklisted ? 'Unbanned' : 'Points Added')
    });
  };

  const checkEligibility = (userId: string) => {
    const u = usersDb[userId];
    if (!u) return true;
    if (u.isBlacklisted) {
      alert("คุณติดแบล็คลิสต์ (เนื่องจากคะแนนสะสมถึงเกณฑ์ หรือ กรณีอุปกรณ์สูญหาย) กรุณาติดต่อที่ห้องสโมสรนักศึกษา คณะวิทยาศาสตร์ เพื่อดำเนินการแก้ไข");
      return false;
    }
    if (u.suspendedUntil && u.suspendedUntil > Date.now()) {
      const untilDate = new Date(u.suspendedUntil).toLocaleDateString('th-TH');
      alert(`คุณถูกระงับการยืมชั่วคราว จนถึงวันที่ ${untilDate} เนื่องจากคะแนนความประพฤติถึงเกณฑ์ กรุณาติดต่อสโมสรฯ`);
      return false;
    }
    return true;
  };

  const handleSubmitBooking = (bookingData: Omit<Booking, 'id' | 'ticketCode' | 'createdAt' | 'status'>) => {
    const ticketCode = `SCI-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      ticketCode,
      createdAt: `${dateStr} ${timeStr}`,
      status: 'pending',
    };

    addBookingDb(newBooking);
    
    if (!usersDb[bookingData.studentId]) {
      addUserDb({
        id: bookingData.studentId,
        name: bookingData.studentName,
        role: 'student',
        department: bookingData.department || 'ไม่ระบุ',
        penaltyPoints: 0,
        isBlacklisted: false
      });
    }

    pushLog(
      `${bookingData.studentName} (${bookingData.studentId.substring(0, 3)}xxx) ได้จอง ${bookingData.equipmentName} จำนวน ${bookingData.quantity} ชิ้น`,
      'booking'
    );
  };

  // 2. Staff approves the booking (Approved state) -> Deducts availableStock
  const handleApproveBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    // Deduct stock
    const eq = equipment.find(e => e.id === targetBooking.equipmentId);
    if (eq) {
      const nextStock = Math.max(0, eq.availableStock - targetBooking.quantity);
      updateEquipmentDb(eq.id, {
        availableStock: nextStock,
        status: nextStock === 0 ? 'borrowed' : eq.status,
      });
    }

    // Update booking status
    updateBookingDb(bookingId, { status: 'approved' });

    pushLog(
      `สตาฟฟ์อนุมัติคิวจอง ${targetBooking.ticketCode} (${targetBooking.equipmentName}) เรียบร้อยแล้ว`,
      'booking'
    );
  };

  // 3. Staff hands over the physical item (Active/Borrowed state)
  const handlePickupBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    updateBookingDb(bookingId, { status: 'active' });

    pushLog(
      `${targetBooking.studentName} รับมอบ ${targetBooking.equipmentName} ออกนอกห้องสโมสรฯ แล้ว`,
      'borrow'
    );
  };

  // 4. Staff rejects the booking (Rejected state)
  const handleRejectBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    updateBookingDb(bookingId, { status: 'rejected' });

    pushLog(`สตาฟฟ์ปฏิเสธคิวจอง ${targetBooking.ticketCode} ของ ${targetBooking.studentName}`, 'system');
  };

  // 5. Staff processes item return (Returned state) -> Adds back to stock
  const handleReturnBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    // Restore stock
    const eq = equipment.find(e => e.id === targetBooking.equipmentId);
    if (eq) {
      const nextStock = Math.min(eq.totalStock, eq.availableStock + targetBooking.quantity);
      updateEquipmentDb(eq.id, {
        availableStock: nextStock,
        status: 'available', // Reset status as items are available again
      });
    }

    // Update booking status
    updateBookingDb(bookingId, { status: 'returned' });

    pushLog(
      `ได้รับคืน ${targetBooking.equipmentName} (${targetBooking.quantity} ชิ้น) จาก ${targetBooking.studentName} สต็อกอัพเดทแล้ว`,
      'return'
    );
  };

  // 6. User cancels their booking
  const handleCancelBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    // If already approved, return the stock back to catalog
    if (targetBooking.status === 'approved') {
      const eq = equipment.find(e => e.id === targetBooking.equipmentId);
      if (eq) {
        updateEquipmentDb(eq.id, {
          availableStock: Math.min(eq.totalStock, eq.availableStock + targetBooking.quantity),
        });
      }
    }

    deleteBookingDb(bookingId);
    pushLog(`ผู้ใช้ยกเลิกคิวจองหมายเลข ${targetBooking.ticketCode} ด้วยตัวเอง`, 'system');
  };

  const handleUpdateEquipmentStock = (equipmentId: string, newTotal: number) => {
    const eq = equipment.find(e => e.id === equipmentId);
    if (eq) {
      const diff = newTotal - eq.totalStock;
      updateEquipmentDb(equipmentId, {
        totalStock: newTotal,
        availableStock: Math.max(0, eq.availableStock + diff)
      });
    }
    pushLog(`สตาฟฟ์อัพเดทสต็อกอุปกรณ์สำเร็จ`, 'system');
  };

  // 7. Toggle maintenance mode of equipment
  const handleToggleMaintenance = (equipmentId: string) => {
    const eq = equipment.find(e => e.id === equipmentId);
    if (eq) {
      const isNowMaint = eq.status !== 'maintenance';
      
      if (isNowMaint) {
        pushLog(`สตาฟฟ์นำ ${eq.thaiName} เข้าสู่โหมดส่งซ่อมบำรุงชั่วคราว`, 'maintenance');
        updateEquipmentDb(equipmentId, {
          status: 'maintenance',
          availableStock: 0 // Cannot borrow during maintenance
        });
      } else {
        pushLog(`นำ ${eq.thaiName} กลับมาเปิดให้บริการตามปกติ`, 'system');
        updateEquipmentDb(equipmentId, {
          status: 'available',
          availableStock: eq.totalStock // Recover original stock
        });
      }
    }
  };

  // Action helper when user clicks book online from a card
  const handleQuickBookSelect = (item: Equipment) => {
    if (user && user.role === 'student') {
      if (!checkEligibility(user.id)) return;
    }
    setPreselectedEq(item);
    setIsBookingOpen(true);
  };

  if (viewMode === 'landing') {
    return <LandingView onNavigateToLogin={() => setViewMode('login')} />;
  }

  if (viewMode === 'login') {
    return (
      <LoginView
        onBack={() => setViewMode('landing')}
        onLogin={(usr) => {
          setUser(usr as User);
          if (!usersDb[usr.id]) {
            addUserDb({
              id: usr.id,
              name: usr.name,
              role: usr.role,
              department: usr.department || 'ไม่ระบุ',
              penaltyPoints: 0,
              isBlacklisted: false
            });
          }
          setActiveTab('catalog');
          setViewMode('app');
          pushLog(`เข้าสู่ระบบในฐานะ ${usr.role === 'staff' ? 'สตาฟฟ์สโมสรฯ' : 'นักศึกษา'}: ${usr.name} (${usr.id}) สำเร็จ`, 'system');
        }}
      />
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#e3e3e4] text-gray-800 font-sans selection:bg-[#397d54] selection:text-white" id="main-layout">
      {/* Primary Sporty Nav Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-40" id="global-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="header-container">
          <div className="flex justify-between items-center h-16" id="header-flex">
            {/* Logo/Identity */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('catalog')} id="logo-block">
              <div className="w-10 h-10 bg-[#397d54] rounded-xl flex items-center justify-center border border-emerald-500/10 shadow-sm" id="logo-icon-wrap">
                <Trophy className="text-[#e0ac04]" size={20} />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-gray-900 tracking-tight flex items-center gap-1">
                  SCI-SPORTS
                  <span className="text-[10px] bg-emerald-50 text-[#397d54] border border-emerald-100 px-1.5 py-0.5 rounded-full font-black">สโมสรนักศึกษา</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-semibold tracking-wide">คณะวิทยาศาสตร์ มหาวิทยาลัยราชภัฏพระนคร</p>
              </div>
            </div>

            {/* Desktop Navigation Menu & User Widget */}
            <div className="flex items-center gap-3" id="nav-and-user-block">
              <nav className="flex items-center h-full gap-1" id="nav-menu">
                <button
                  onClick={() => { setActiveTab('catalog'); setPreselectedEq(null); }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'catalog'
                      ? 'bg-[#397d54] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  id="btn-nav-catalog"
                >
                  <Compass size={14} />
                  {t('ตรวจสอบอุปกรณ์', 'Equipment')}
                </button>
                
                

                {user.role === 'staff' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'admin'
                        ? 'bg-gray-900 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    id="btn-nav-admin"
                  >
                    <Shield size={14} className="text-[#e0ac04]" />
                    {t('สตาฟฟ์สโมฯ', 'Staff')}
                  </button>
                )}
              </nav>

              {/* Notifications Widget */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (!notificationsOpen) {
                      setReadNotificationIds(prev => Array.from(new Set([...prev, ...alerts.map(a => a.id)])));
                    }
                    setNotificationsOpen(!notificationsOpen);
                  }}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all relative ${notificationsOpen ? 'bg-rose-50 text-rose-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                  title={t('การแจ้งเตือน', 'Notifications')}
                  id="btn-notifications-bell"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                {/* Dropdown */}
                {notificationsOpen && <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>}
                <AnimatePresence>
                {notificationsOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden origin-top-right"
                    >
                      <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                          <Bell size={14} className="text-rose-500" />
                          การแจ้งเตือนอุปกรณ์
                        </h4>
                        <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-md font-bold text-gray-500">{alerts.length}</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                        {alerts.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            <Check size={24} className="mx-auto mb-2 opacity-30" />
                            <p className="text-xs font-bold text-gray-500">ไม่มีการแจ้งเตือน</p>
                          </div>
                        ) : (
                          alerts.map((al) => {
                            const bgStyle =
                              al.type === 'danger' ? 'bg-rose-50/90 border-rose-100' :
                              al.type === 'warning' ? 'bg-amber-50/90 border-amber-100' :
                              al.type === 'success' ? 'bg-emerald-50/90 border-emerald-100' :
                              'bg-blue-50/90 border-blue-100';

                            const iconBg =
                              al.type === 'danger' ? 'bg-rose-100 text-rose-600' :
                              al.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                              al.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                              'bg-blue-100 text-blue-600';

                            const titleColor =
                              al.type === 'danger' ? 'text-rose-800' :
                              al.type === 'warning' ? 'text-amber-900' :
                              al.type === 'success' ? 'text-emerald-900' :
                              'text-blue-900';

                            const textColor =
                              al.type === 'danger' ? 'text-rose-600' :
                              al.type === 'warning' ? 'text-amber-700' :
                              al.type === 'success' ? 'text-emerald-700' :
                              'text-blue-700';

                            return (
                              <div key={al.id} className={`p-3 rounded-xl border flex gap-3 items-start transition-all hover:scale-[1.01] ${bgStyle}`}>
                                <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}>
                                  {al.type === 'danger' && <AlertCircle size={14} />}
                                  {al.type === 'warning' && <AlertCircle size={14} />}
                                  {al.type === 'success' && <CheckCircle2 size={14} />}
                                  {al.type === 'info' && <Info size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-1 mb-0.5">
                                    <p className={`text-[12px] font-black leading-tight ${titleColor}`}>{al.name}</p>
                                    {al.time && (
                                      <span className="text-[9px] font-bold text-gray-500 bg-white/90 px-1.5 py-0.5 rounded-md border border-gray-200/80 shrink-0">
                                        {formatBookingDateTime(al.time)}
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-[11px] mt-0.5 font-medium leading-relaxed ${textColor}`}>{al.msg}</p>
                                  <button 
                                    className="text-[10px] bg-white text-gray-700 border border-gray-200 mt-2 font-bold hover:bg-gray-50 hover:text-gray-900 transition px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer"
                                    onClick={() => { setActiveTab(user?.role === 'staff' ? 'admin' : 'profile'); setNotificationsOpen(false); }}
                                  >
                                    {user?.role === 'staff' ? 'ดูรายละเอียดในระบบจัดการ' : 'ดูรายละเอียดในโปรไฟล์'} &rarr;
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => {
                  playPop();
                  setIsSettingsOpen(true);
                }}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                title={t('ตั้งค่าระบบ', 'Settings')}
              >
                <Settings size={18} />
              </button>

              {/* Active User Widget with Logout */}
              <div 
                className={`flex items-center gap-2 border pl-3 pr-2 py-1 rounded-xl text-xs cursor-pointer transition ${activeTab === 'profile' ? 'bg-emerald-100 border-[#397d54]' : 'bg-emerald-50 border-emerald-100 hover:bg-emerald-100'}`} 
                id="header-user-widget"
                onClick={() => setActiveTab('profile')}
              >
                <div className="flex flex-col text-right hidden lg:block" id="user-text-info">
                  <p className="font-extrabold text-emerald-950 leading-tight text-[11px]">{user.name}</p>
                  <p className="text-[9px] text-[#397d54] font-bold tracking-wider">
                    {user.role === 'staff' ? t('พี่สตาฟฟ์สโมสรฯ', 'Club Staff') : `${t('นักศึกษา ID:', 'Student ID:')} ${user.id}`}
                  </p>
                </div>
                <div className="w-8 h-8 bg-[#397d54] text-white rounded-lg flex items-center justify-center font-black text-xs border border-emerald-300 shadow-sm" id="user-avatar" title={user.name}>
                  {user.name.substring(0, 2)}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    pushLog(`ผู้ใช้ ${user.name} ลงชื่อออกจากระบบ`, 'system');
                    setUser(null);
                    setActiveTab('catalog');
                    setViewMode('landing');
                  }}
                  className="p-1 text-emerald-800 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-1"
                  title={t('ออกจากระบบ', 'Logout')}
                  id="btn-logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="stage">
        {/* Announcements Banner */}
        {activeTab === 'catalog' && (
          <HeroBanner />
        )}

        {/* Top Live Analytics Feed (Staff Only) */}
        {user.role === 'staff' && activeTab === 'admin' && (
          <LiveFeed logs={logs} equipment={equipment} bookings={bookings} userRole={user.role} />
        )}

        {/* Modular Content Transitions */}
        <div className="min-h-[450px]" id="modular-content-panel">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="profile-view-stage"
              >
                <StudentProfile
                  user={user}
                  bookings={bookings}
                  onNavigateCatalog={() => setActiveTab('catalog')}
                  onCancelBooking={handleCancelBooking}
                  onReportIssue={handleReportIssue}
                />
              </motion.div>
            )}

            {activeTab === 'catalog' && (
              <motion.div
                key="catalog-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="catalog-view-stage"
              >
                <EquipmentGrid
                  equipment={equipment}
                  onSelectBooking={handleQuickBookSelect}
                />
              </motion.div>
            )}



            {activeTab === 'admin' && (
              <motion.div
                key="admin-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="admin-view-stage"
              >
                {user.role !== 'staff' ? (
                  <div className="bg-white border border-[#e3e3e4] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto my-8 space-y-6 shadow-sm" id="restricted-panel">
                    <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-[#e0ac04] rounded-2xl flex items-center justify-center mx-auto shadow-sm" id="restricted-icon-box">
                      <Lock size={32} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight">เฉพาะสตาฟฟ์สโมสรนักศึกษาเท่านั้น</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                        แท็บระบบควบคุมนี้สงวนสิทธิ์ไว้ให้สำหรับ พี่สตาฟฟ์สโมสรฯ เพื่อใช้สำหรับอนุมัติการจอง ส่งมอบอุปกรณ์ และตรวจสอบการส่งคืน
                      </p>
                    </div>
                    
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-left text-xs max-w-md mx-auto space-y-1.5 text-emerald-950" id="bypass-hint-card">
                      <p className="font-extrabold flex items-center gap-1.5 text-[#397d54]">
                        💡 ต้องการสวมบทสตาฟฟ์เพื่อทดสอบระบบ?
                      </p>
                      <p className="font-light text-gray-600">
                        คุณสามารถกดปุ่ม "อัพเกรดเป็นสตาฟฟ์ชั่วคราว" ด้านล่างเพื่อสลับสิทธิ์การทดสอบได้ทันทีโดยไม่ต้องออกระบบใหม่
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2" id="bypass-buttons">
                      <button
                        onClick={() => {
                          setUser({
                            name: 'สตาฟฟ์สมโภช ห้องสโมฯ',
                            id: 'STAFF-MAIN',
                            role: 'staff'
                          });
                          pushLog(`ผู้ใช้จำลองสลับบทบาทเป็น สตาฟฟ์สโมสรฯ สำเร็จ`, 'system');
                        }}
                        className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
                        id="upgrade-to-staff"
                      >
                        ⚡ อัพเกรดเป็นสตาฟฟ์ (Staff Bypass)
                      </button>
                      <button
                        onClick={() => {
                          pushLog(`ผู้ใช้ลงชื่อออกจากระบบเพื่อสลับบัญชี`, 'system');
                          setUser(null);
                          setActiveTab('catalog');
                          setViewMode('login');
                        }}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition cursor-pointer"
                        id="logout-back-to-login"
                      >
                        ล็อกเอาท์สลับบัญชี
                      </button>
                    </div>
                  </div>
                ) : (
                  <AdminPanel
                  usersDb={Object.values(usersDb)}
                  penaltyLogs={penaltyLogs}
                  onUpdateUserStatus={handleUpdateUserStatus}
                  onResolveIssue={(bookingId) => {
                    updateBookingDb(bookingId, { issueStatus: 'resolved' });
                  }}
                    bookings={bookings}
                    equipment={equipment}
                    onApproveBooking={handleApproveBooking}
                    onRejectBooking={handleRejectBooking}
                    onPickupBooking={handlePickupBooking}
                    onReturnBooking={handleReturnBooking}
                    onToggleMaintenance={handleToggleMaintenance}
                    onUpdateStock={handleUpdateEquipmentStock}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-gray-300 py-6 mt-16 text-center text-xs text-gray-500" id="global-footer">
        <div className="max-w-7xl mx-auto px-4" id="footer-container">
          <p className="font-bold text-gray-700">สโมสรนักศึกษา คณะวิทยาศาสตร์ มหาวิทยาลัยราชภัฏพระนคร</p>
          <p className="mt-1 font-light">ระบบให้บริการยืม-คืนอุปกรณ์กีฬาออนไลน์ • ตรวจสอบสถานะเรียลไทม์ • จองล่วงหน้าได้อย่างสะดวกและรวดเร็ว</p>
          <div className="flex flex-wrap justify-center items-center gap-6 mt-3" id="system-features-preview">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <Compass size={14} /> ค้นหาและตรวจสอบสถานะง่ายดาย
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <ClipboardList size={14} /> ระบบการจองที่แม่นยำ
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <Shield size={14} /> การจัดการที่มีประสิทธิภาพ
            </span>
          </div>
        </div>
      </footer>
      <AnimatePresence>
        {isBookingOpen && (
          <BookingForm
            equipmentList={equipment}
            preselectedItem={preselectedEq}
            onClearPreselected={() => setPreselectedEq(null)}
            onBack={() => { setPreselectedEq(null); setIsBookingOpen(false); }}
            onSubmitBooking={handleSubmitBooking}
            activeBookings={bookings}
            onCancelBooking={handleCancelBooking}
            currentUser={user}
          />
        )}
      </AnimatePresence>
      <SettingsModal />

      {/* Floating Contact Support */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isHelpOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-[280px] bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden"
            >
              <div className="bg-[#397d54] p-4 text-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">{t('ต้องการความช่วยเหลือ?', 'Need Help?')}</h4>
                  <p className="text-[10px] text-emerald-100 mt-0.5">{t('ติดต่อสตาฟฟ์สโมสรนักศึกษา', 'Contact Student Club Staff')}</p>
                </div>
                <button onClick={() => setIsHelpOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition">
                  <X size={16} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                 <a 
                   href="https://www.facebook.com/profile.php?id=100063495553443" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-blue-50/50 transition rounded-xl group cursor-pointer border border-transparent hover:border-blue-100"
                 >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Bell size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-800">Facebook Page</p>
                       <p className="text-[10px] text-gray-500">สโมสรนักศึกษา คณะวิทย์ฯ</p>
                    </div>
                 </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => {
            playPop();
            setIsHelpOpen(!isHelpOpen);
          }}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isHelpOpen ? 'bg-gray-800 text-white rotate-90 scale-90' : 'bg-[#e0ac04] hover:bg-[#c99a03] text-gray-900 hover:scale-105'}`}
        >
          {isHelpOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

    </div>
  );
}
