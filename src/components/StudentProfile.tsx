import React from 'react';
import { motion } from 'motion/react';
import { User, Booking } from '../types';
import { User as UserIcon, Calendar, CheckCircle2, Clock, XCircle, Package, ArrowRight, Activity, Award, Check } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { formatBookingDateTime } from '../lib/format';

interface StudentProfileProps {
  user: User;
  bookings: Booking[];
  onNavigateCatalog: () => void;
  onCancelBooking: (bookingId: string) => void;
  onReportIssue?: (bookingId: string, details: string) => void;
}

import { useState, useEffect } from 'react';

export default function StudentProfile({ user, bookings, onNavigateCatalog, onCancelBooking, onReportIssue }: StudentProfileProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingBookingId, setReportingBookingId] = useState<string | null>(null);
  const [reportText, setReportText] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const getCountdownText = (returnTime: string) => {
    if (!returnTime || returnTime === 'ไม่ระบุ') return '';
    try {
      const [retHour, retMin] = returnTime.split(':').map(Number);
      const now = currentTime;
      const currHour = now.getHours();
      const currMin = now.getMinutes();
      
      const retTotalMins = retHour * 60 + retMin;
      const currTotalMins = currHour * 60 + currMin;
      
      const diff = retTotalMins - currTotalMins;
      
      if (diff < 0) {
        return <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded ml-2 border border-rose-200 text-[10px]">เลยกำหนดคืน!</span>;
      } else if (diff <= 30) {
        return <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded ml-2 border border-amber-200 text-[10px]">เหลือ {diff} นาที</span>;
      } else {
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded ml-2 border border-emerald-200 text-[10px]">เหลือ {h} ชม. {m} นาที</span>;
      }
    } catch (e) {
      return '';
    }
  };

  const handleOpenReport = (bookingId: string) => {
    setReportingBookingId(bookingId);
    setReportText('');
    setReportModalOpen(true);
  };

  const submitReport = () => {
    if (reportingBookingId && reportText.trim() && onReportIssue) {
      onReportIssue(reportingBookingId, reportText);
      setReportModalOpen(false);
      setReportingBookingId(null);
    }
  };
  const { t } = useSettings();
  const userBookings = [...bookings]
    .filter(b => b.studentId === user.id)
    .sort((a, b) => {
      const numA = parseInt(a.id.replace(/[^0-9]/g, ''), 10) || 0;
      const numB = parseInt(b.id.replace(/[^0-9]/g, ''), 10) || 0;
      if (numA !== numB) return numB - numA;
      return b.id.localeCompare(a.id);
    });
  
  const pending = userBookings.filter(b => b.status === 'pending');
  const approved = userBookings.filter(b => b.status === 'approved' || b.status === 'active');
  const history = userBookings.filter(b => b.status === 'returned' || b.status === 'rejected');
  
  const totalBorrowed = history.filter(b => b.status === 'returned').length + approved.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-200">รออนุมัติ</span>;
      case 'approved':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-200">รอรับของ</span>;
      case 'active':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">กำลังใช้งาน</span>;
      case 'returned':
        return <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2.5 py-1 rounded-full border border-gray-200">คืนแล้ว</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-rose-200">ยกเลิก</span>;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6 pb-12"
    >
      {/* Banner & Profile Card */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        {/* Abstract Banner Background */}
        <div className="h-32 bg-gradient-to-r from-[#397d54] to-emerald-400 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute top-5 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="px-6 md:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 relative z-10">
            {/* Avatar */}
            <div className="w-32 h-32 bg-white rounded-3xl p-1.5 shadow-md">
              <div className="w-full h-full bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center">
                <span className="text-5xl font-black text-[#397d54]">{user.name.substring(0, 2)}</span>
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left pb-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-sm">
                  <UserIcon size={14} className="text-[#397d54]" /> ID: {user.id}
                </span>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-sm border ${
                  user.role === 'staff' ? 'bg-[#397d54] text-white border-[#2e6242]' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {user.role === 'staff' ? <Award size={14} /> : <CheckCircle2 size={14} />}
                  {user.role === 'staff' ? 'สตาฟฟ์สโมสรฯ' : 'นักศึกษา'}
                </span>
                {user.department && (
                  <span className="px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold">
                    {user.department}
                  </span>
                )}
                {user.penaltyPoints ? (
                  <span className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1">
                    แต้มหัก: {user.penaltyPoints}
                  </span>
                ) : null}
                {user.isBlacklisted ? (
                  <span className="px-3 py-1.5 bg-black border border-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 uppercase tracking-widest">
                    BLACKLISTED
                  </span>
                ) : (user.suspendedUntil && user.suspendedUntil > Date.now()) ? (
                  <span className="px-3 py-1.5 bg-amber-100 border border-amber-300 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1">
                    ระงับการยืมถึง: {new Date(user.suspendedUntil).toLocaleDateString('th-TH')}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Quick Action */}
            <div className="w-full md:w-auto pb-2">
              <button 
                onClick={(user.isBlacklisted || (user.suspendedUntil && user.suspendedUntil > Date.now())) ? undefined : onNavigateCatalog}
                disabled={user.isBlacklisted || (user.suspendedUntil && user.suspendedUntil > Date.now())}
                className={`w-full md:w-auto px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 group ${(user.isBlacklisted || (user.suspendedUntil && user.suspendedUntil > Date.now())) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-gray-900 hover:bg-black text-white hover:shadow-lg'}`}
              >
                ยืมอุปกรณ์เพิ่ม
                <ArrowRight size={16} className={((user.isBlacklisted || (user.suspendedUntil && user.suspendedUntil > Date.now()))) ? '' : 'group-hover:translate-x-1 transition-transform'} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sidebar: Stats & Mini-Widgets */}
        <div className="md:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-900 mb-5 flex items-center gap-2">
              <Activity size={18} className="text-[#397d54]" />
              สถิติของคุณ
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                <span className="block text-2xl font-black text-gray-900">{totalBorrowed}</span>
                <span className="text-[10px] font-bold text-gray-500 mt-1 block">เคยยืมทั้งหมด (ครั้ง)</span>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center">
                <span className="block text-2xl font-black text-[#397d54]">{approved.length}</span>
                <span className="text-[10px] font-bold text-emerald-700 mt-1 block">กำลังใช้งาน</span>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center col-span-2 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-amber-800 block">คิวรออนุมัติ</span>
                  <span className="text-xs font-medium text-amber-700">กำลังรอสตาฟฟ์ตรวจสอบ</span>
                </div>
                <span className="text-2xl font-black text-amber-600">{pending.length}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Rules Mini Widget */}
          <motion.div variants={itemVariants} className="bg-gray-900 rounded-3xl p-6 shadow-sm text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-white/5">
              <CheckCircle2 size={100} />
            </div>
            <h3 className="text-sm font-extrabold mb-3 relative z-10">ข้อควรจำ 💡</h3>
            <ul className="space-y-2 text-xs text-gray-300 relative z-10 font-medium">
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>คืนอุปกรณ์ตรงเวลาตามที่กำหนด</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>รักษาสภาพอุปกรณ์ให้สมบูรณ์</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>หากชำรุด โปรดแจ้งสตาฟฟ์ทันที</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Right Main Content: Bookings */}
        <div className="md:col-span-8 space-y-6">
          {/* Active Bookings Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Package size={20} className="text-[#397d54]" />
                รายการที่กำลังดำเนินการ
              </h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                {pending.length + approved.length} รายการ
              </span>
            </div>

            {pending.length === 0 && approved.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 text-gray-300">
                  <Package size={32} />
                </div>
                <h4 className="text-base font-extrabold text-gray-900">ไม่มีรายการกำลังใช้งาน</h4>
                <p className="text-sm font-medium text-gray-500 mt-1 max-w-sm mx-auto">คุณยังไม่มีการจองอุปกรณ์หรือรายการที่กำลังใช้งานอยู่ในขณะนี้</p>
                <button 
                  onClick={onNavigateCatalog}
                  className="mt-6 px-6 py-2.5 bg-white border border-gray-200 text-gray-800 rounded-xl text-sm font-bold hover:border-[#397d54] hover:text-[#397d54] transition shadow-sm"
                >
                  ค้นหาอุปกรณ์
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {[...pending, ...approved].map(booking => (
                  <div key={booking.id} className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#397d54]/50 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${booking.status === 'pending' ? 'bg-amber-400' : 'bg-[#397d54]'}`}></div>
                    <div className="pl-2 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{booking.ticketCode}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <h4 className="font-black text-base text-gray-900">{booking.equipmentName}</h4>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1.5"><Package size={14} /> {booking.quantity} ชิ้น</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> คืน: <strong className="text-gray-800">{booking.returnTime}</strong> {booking.status === 'active' && getCountdownText(booking.returnTime)}</span>
                      </div>
                      {booking.issueReported && (
                        <div className="mt-2 text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-center gap-2">
                           ⚠️ แจ้งปัญหาแล้ว: {booking.issueDetails} {booking.issueStatus === 'resolved' && <span className="text-emerald-600">(แก้ไขแล้ว)</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                    {booking.status === 'active' && !booking.issueReported && (
                      <button 
                        onClick={() => handleOpenReport(booking.id)}
                        className="px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-50 hover:border-amber-300 transition flex items-center gap-2 whitespace-nowrap"
                      >
                        รายงานปัญหา
                      </button>
                    )}
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => onCancelBooking(booking.id)}
                        className="px-4 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:border-rose-300 transition flex items-center gap-2 whitespace-nowrap"
                      >
                        <XCircle size={16} />
                        ยกเลิกการจอง
                      </button>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* History Section */}
          {history.length > 0 && (
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-gray-400" />
                ประวัติย้อนหลัง
              </h3>
              <div className="space-y-3">
                {(showAllHistory ? history : history.slice(0, 5)).map(booking => (
                  <div key={booking.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 opacity-80 hover:opacity-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center shrink-0">
                        <Package size={20} className={booking.status === 'returned' ? 'text-blue-500' : 'text-gray-400'} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold text-gray-500">{booking.ticketCode}</span>
                          {getStatusBadge(booking.status)}
                        </div>
                        <p className="text-sm font-bold text-gray-800">{booking.equipmentName} <span className="text-gray-500 font-normal ml-1">x{booking.quantity}</span></p>
                      </div>
                    </div>
                    <div className="text-right sm:text-right shrink-0">
                      <span className="text-[11px] text-gray-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-gray-200/80 shadow-2xs inline-flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" />
                        {formatBookingDateTime(booking.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                {history.length > 5 && (
                  <button 
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="w-full py-3 mt-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 border border-gray-200/60"
                  >
                    {showAllHistory ? 'ย่อประวัติ' : `ดูประวัติทั้งหมด (${history.length})`}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl border border-gray-100"
          >
            <h3 className="text-xl font-black text-gray-900 mb-2">รายงานปัญหาอุปกรณ์</h3>
            <p className="text-sm font-medium text-gray-500 mb-6">โปรดระบุปัญหาที่คุณพบเกี่ยวกับอุปกรณ์ชิ้นนี้ สตาฟฟ์จะทำการตรวจสอบ</p>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none min-h-[120px] mb-6 resize-none transition-all"
              placeholder="เช่น ลูกบอลแบน, ไม้แบดเอ็นขาด..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            ></textarea>
            <div className="flex gap-3">
              <button 
                onClick={() => setReportModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                ยกเลิก
              </button>
              <button 
                onClick={submitReport}
                disabled={!reportText.trim()}
                className="flex-1 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                ส่งรายงาน
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
