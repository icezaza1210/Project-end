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
import { Trophy, Compass, ClipboardList, Shield, AlertCircle, Sparkles, LogOut, Lock, Settings, MessageCircle, X, Bell, Radio } from 'lucide-react';

export default function App() {
  const { t, setIsSettingsOpen, playPop } = useSettings();
  
  // Main states
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>(INITIAL_EQUIPMENT);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [activeTab, setActiveTab] = useState<'catalog' | 'booking' | 'admin' | 'profile'>('catalog');
  const [preselectedEq, setPreselectedEq] = useState<Equipment | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Helper to push a new activity log
  const pushLog = (message: string, type: 'booking' | 'borrow' | 'return' | 'maintenance' | 'system') => {
    const time = new Date();
    const timestampStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')} น.`;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      message,
      type
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // 1. Submit online booking (Pending state)
  const handleSubmitBooking = (bookingData: Omit<Booking, 'id' | 'ticketCode' | 'createdAt' | 'status'>) => {
    const ticketCode = `SCI-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      ticketCode,
      createdAt: new Date().toLocaleTimeString('th-TH'),
      status: 'pending',
    };

    setBookings((prev) => [...prev, newBooking]);
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
    setEquipment((prevEq) =>
      prevEq.map((eq) => {
        if (eq.id === targetBooking.equipmentId) {
          const nextStock = Math.max(0, eq.availableStock - targetBooking.quantity);
          return {
            ...eq,
            availableStock: nextStock,
            status: nextStock === 0 ? 'borrowed' : eq.status,
          };
        }
        return eq;
      })
    );

    // Update booking status
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === bookingId ? { ...b, status: 'approved' } : b))
    );

    pushLog(
      `สตาฟฟ์อนุมัติคิวจอง ${targetBooking.ticketCode} (${targetBooking.equipmentName}) เรียบร้อยแล้ว`,
      'booking'
    );
  };

  // 3. Staff hands over the physical item (Active/Borrowed state)
  const handlePickupBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === bookingId ? { ...b, status: 'active' } : b))
    );

    pushLog(
      `${targetBooking.studentName} รับมอบ ${targetBooking.equipmentName} ออกนอกห้องสโมสรฯ แล้ว`,
      'borrow'
    );
  };

  // 4. Staff rejects the booking (Rejected state)
  const handleRejectBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === bookingId ? { ...b, status: 'rejected' } : b))
    );

    pushLog(`สตาฟฟ์ปฏิเสธคิวจอง ${targetBooking.ticketCode} ของ ${targetBooking.studentName}`, 'system');
  };

  // 5. Staff processes item return (Returned state) -> Adds back to stock
  const handleReturnBooking = (bookingId: string) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) return;

    // Restore stock
    setEquipment((prevEq) =>
      prevEq.map((eq) => {
        if (eq.id === targetBooking.equipmentId) {
          const nextStock = Math.min(eq.totalStock, eq.availableStock + targetBooking.quantity);
          return {
            ...eq,
            availableStock: nextStock,
            status: 'available', // Reset status as items are available again
          };
        }
        return eq;
      })
    );

    // Update booking status
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === bookingId ? { ...b, status: 'returned' } : b))
    );

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
      setEquipment((prevEq) =>
        prevEq.map((eq) => {
          if (eq.id === targetBooking.equipmentId) {
            return {
              ...eq,
              availableStock: Math.min(eq.totalStock, eq.availableStock + targetBooking.quantity),
            };
          }
          return eq;
        })
      );
    }

    setBookings((prevBookings) => prevBookings.filter((b) => b.id !== bookingId));
    pushLog(`ผู้ใช้ยกเลิกคิวจองหมายเลข ${targetBooking.ticketCode} ด้วยตัวเอง`, 'system');
  };

  // 7. Toggle maintenance mode of equipment
  const handleToggleMaintenance = (equipmentId: string) => {
    setEquipment((prevEq) =>
      prevEq.map((eq) => {
        if (eq.id === equipmentId) {
          const isNowMaint = eq.status !== 'maintenance';
          
          if (isNowMaint) {
            pushLog(`สตาฟฟ์นำ ${eq.thaiName} เข้าสู่โหมดส่งซ่อมบำรุงชั่วคราว`, 'maintenance');
            return {
              ...eq,
              status: 'maintenance',
              availableStock: 0 // Cannot borrow during maintenance
            };
          } else {
            pushLog(`นำ ${eq.thaiName} กลับมาเปิดให้บริการตามปกติ`, 'system');
            return {
              ...eq,
              status: 'available',
              availableStock: eq.totalStock // Recover original stock
            };
          }
        }
        return eq;
      })
    );
  };

  // Action helper when user clicks book online from a card
  const handleQuickBookSelect = (item: Equipment) => {
    setPreselectedEq(item);
    setActiveTab('booking');
  };

  if (viewMode === 'landing') {
    return <LandingView onNavigateToLogin={() => setViewMode('login')} />;
  }

  if (viewMode === 'login') {
    return (
      <LoginView
        onBack={() => setViewMode('landing')}
        onLogin={(usr) => {
          setUser(usr);
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
                
                <button
                  onClick={() => setActiveTab('booking')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 relative ${
                    activeTab === 'booking'
                      ? 'bg-[#397d54] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  id="btn-nav-booking"
                >
                  <ClipboardList size={14} />
                  {t('จองออนไลน์', 'Book Online')}
                  {bookings.filter(b => b.status === 'pending').length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e0ac04] text-gray-900 text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                      {bookings.filter(b => b.status === 'pending').length}
                    </span>
                  )}
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
        {activeTab !== 'admin' && (
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

            {activeTab === 'booking' && (
              <motion.div
                key="booking-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                id="booking-view-stage"
              >
                <BookingForm
                  equipmentList={equipment}
                  preselectedItem={preselectedEq}
                  onClearPreselected={() => setPreselectedEq(null)}
                  onSubmitBooking={handleSubmitBooking}
                  activeBookings={bookings}
                  onCancelBooking={handleCancelBooking}
                  currentUser={user}
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
                    bookings={bookings}
                    equipment={equipment}
                    onApproveBooking={handleApproveBooking}
                    onRejectBooking={handleRejectBooking}
                    onPickupBooking={handlePickupBooking}
                    onReturnBooking={handleReturnBooking}
                    onToggleMaintenance={handleToggleMaintenance}
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
                 <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition rounded-xl group cursor-pointer border border-transparent hover:border-blue-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Bell size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-800">Facebook Page</p>
                       <p className="text-[10px] text-gray-500">สโมสรนักศึกษา คณะวิทย์ฯ</p>
                    </div>
                 </a>
                 <a href="#" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 transition rounded-xl group cursor-pointer border border-transparent hover:border-green-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Radio size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-gray-800">Line Official</p>
                       <p className="text-[10px] text-gray-500">@scisports_pnru</p>
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
