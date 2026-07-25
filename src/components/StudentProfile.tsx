import React from 'react';
import { motion } from 'motion/react';
import { User, Booking } from '../types';
import { User as UserIcon, Calendar, CheckCircle2, Clock, XCircle, Package, ArrowRight, Activity, Award, Check, AlertTriangle, Camera, QrCode, Eye, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface StudentProfileProps {
  user: User;
  bookings: Booking[];
  onNavigateCatalog: () => void;
  onCancelBooking: (bookingId: string) => void;
  onReportIssue?: (bookingId: string, details: string) => void;
  onUpdateProfilePicture?: (dataUrl: string) => void;
}

import { useState, useEffect } from 'react';

export default function StudentProfile({ user, bookings, onNavigateCatalog, onCancelBooking, onReportIssue, onUpdateProfilePicture }: StudentProfileProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingBookingId, setReportingBookingId] = useState<string | null>(null);
  const [reportText, setReportText] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(user.profilePicture || null);
  const [viewingTicket, setViewingTicket] = useState<Booking | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side image compression logic
    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            const MAX_HEIGHT = 500;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            // Compress and convert to base64 or blob
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataUrl);
          };
          img.onerror = (error) => reject(error);
        };
      });
    };

    try {
      // Create preview immediately for good UX
      const previewUrl = URL.createObjectURL(file);
      setProfilePicPreview(previewUrl);
      
      // Compress image
      const compressedDataUrl = await compressImage(file);
      
      // Update profile picture
      if (onUpdateProfilePicture) {
        onUpdateProfilePicture(compressedDataUrl);
      }

    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const getCountdownText = (returnTime: string) => {
    if (!returnTime || returnTime === 'ไม่ระบุ') return '';
    try {
      const parts = returnTime.replace(/[^0-9:]/g, '').split(':');
      if (parts.length < 2) return '';
      const retHour = parseInt(parts[0], 10);
      const retMin = parseInt(parts[1], 10);
      if (isNaN(retHour) || isNaN(retMin)) return '';

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
  const userBookings = bookings.filter(b => b.studentId === user.id);
  
  const pending = userBookings.filter(b => b.status === 'pending');
  const approved = userBookings.filter(b => b.status === 'approved' || b.status === 'active');
  const history = userBookings.filter(b => b.status === 'returned' || b.status === 'rejected');
  
  const totalBorrowed = history.filter(b => b.status === 'returned').length + approved.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-200">รออนุมัติ</span>;
      case 'approved':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">รอรับของ</span>;
      case 'active':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-blue-200">กำลังใช้งาน</span>;
      case 'returned':
        return <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">คืนแล้ว</span>;
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
            <div className="w-32 h-32 bg-white rounded-full p-1.5 shadow-md group relative">
              <input type="file" accept="image/*" className="hidden" id="profile-upload" onChange={handleImageUpload} />
              <label htmlFor="profile-upload" className="w-full h-full block cursor-pointer rounded-full">
                <div className="w-full h-full bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center overflow-hidden relative">
                   {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                      <span className="text-5xl font-black text-[#397d54] uppercase">{user.name.substring(0, 2)}</span>
                   )}
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera size={24} className="text-white mb-1" />
                     <span className="text-white text-[10px] font-bold">เปลี่ยนรูปโปรไฟล์</span>
                   </div>
                </div>
              </label>
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
                {user.role === 'staff' ? 'จัดการระบบ' : 'ยืมอุปกรณ์เพิ่ม'}
                <ArrowRight size={16} className={((user.isBlacklisted || (user.suspendedUntil && user.suspendedUntil > Date.now()))) ? '' : 'group-hover:translate-x-1 transition-transform'} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Account Status Alerts */}
      {(user.isBlacklisted || (user.suspendedUntil && user.suspendedUntil > Date.now())) && (
        <motion.div variants={itemVariants} className={`rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 overflow-hidden relative border ${user.isBlacklisted ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className={`absolute -right-6 -top-6 opacity-[0.03] ${user.isBlacklisted ? 'text-rose-900' : 'text-amber-900'}`}>
             <AlertTriangle size={150} />
          </div>
          <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center relative z-10 shadow-sm ${user.isBlacklisted ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-amber-100 text-amber-600 border border-amber-200'}`}>
            <AlertTriangle size={28} />
          </div>
          <div className="flex-1 text-center sm:text-left relative z-10 pt-1">
             <h3 className={`text-lg font-black mb-1.5 ${user.isBlacklisted ? 'text-rose-700' : 'text-amber-700'}`}>
                {user.isBlacklisted ? 'คุณถูกระงับสิทธิ์การยืมอุปกรณ์ (Blacklisted)' : 'บัญชีของคุณถูกระงับการยืมชั่วคราว'}
             </h3>
             <p className={`text-sm font-medium leading-relaxed ${user.isBlacklisted ? 'text-rose-600/80' : 'text-amber-700/80'}`}>
                {user.isBlacklisted ? 'เนื่องจากคะแนนความประพฤติสะสมเกินกำหนด หรือทำอุปกรณ์สูญหาย กรุณาติดต่อที่ห้องสโมสรนักศึกษา คณะวิทยาศาสตร์ เพื่อดำเนินการแก้ไขและขอปลดแบล็คลิสต์' : `คุณไม่สามารถยืมอุปกรณ์ได้จนถึงวันที่ ${new Date(user.suspendedUntil!).toLocaleDateString('th-TH')} โปรดรักษากฎระเบียบอย่างเคร่งครัดเพื่อหลีกเลี่ยงการถูกแบล็คลิสต์ถาวร`}
             </p>
          </div>
        </motion.div>
      )}

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
              
              {user.role === 'staff' ? (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center col-span-2 flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-amber-800 block">คิวรออนุมัติทั้งหมด (ระบบ)</span>
                    <span className="text-xs font-medium text-amber-700">คำร้องขอที่รอสตาฟฟ์ตรวจสอบ</span>
                  </div>
                  <span className="text-2xl font-black text-amber-600">{bookings.filter(b => b.status === 'pending').length}</span>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center col-span-2 flex justify-between items-center">
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-amber-800 block">คิวรออนุมัติ</span>
                    <span className="text-xs font-medium text-amber-700">กำลังรอสตาฟฟ์ตรวจสอบ</span>
                  </div>
                  <span className="text-2xl font-black text-amber-600">{pending.length}</span>
                </div>
              )}

              {user.role === 'student' && (
                <div className="col-span-2 mt-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                   <div className="flex justify-between items-end mb-2.5">
                     <span className="text-xs font-bold text-gray-700">คะแนนความประพฤติ (Penalty Points)</span>
                     <span className={`text-sm font-black ${user.penaltyPoints! >= 400 ? 'text-rose-600' : 'text-gray-900'}`}>{user.penaltyPoints || 0} / 500</span>
                   </div>
                   <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden inset-shadow-sm">
                     <div 
                        className={`h-full rounded-full transition-all duration-500 ${user.penaltyPoints! >= 400 ? 'bg-rose-500' : user.penaltyPoints! >= 200 ? 'bg-amber-500' : 'bg-[#397d54]'}`} 
                        style={{ width: `${Math.min(100, ((user.penaltyPoints || 0) / 500) * 100)}%` }} 
                     />
                   </div>
                   {user.penaltyPoints! >= 400 && <p className="text-[10px] text-rose-600 font-bold mt-2 text-right">ระวัง! ใกล้ถูกระงับสิทธิ์</p>}
                </div>
              )}
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
                        <div className="mt-2 text-xs font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex flex-col gap-1.5">
                           <div className="text-amber-800 flex items-center gap-1.5">
                             ⚠️ <span className="font-bold">ปัญหา:</span> {booking.issueDetails} 
                             {booking.issueStatus === 'resolved' && <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-1 border border-emerald-100">(แก้ไขแล้ว)</span>}
                           </div>
                           {booking.adminReply && (
                             <div className="pl-5 text-gray-700 bg-white/60 p-2 rounded-lg border border-amber-50 mt-1">
                               <span className="text-[10px] text-gray-500 block mb-0.5 uppercase tracking-wider">ข้อความจากสโมสร</span>
                               {booking.adminReply}
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      <button 
                        onClick={() => setViewingTicket(booking)}
                        className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                      >
                        <QrCode size={16} />
                        ดูตั๋วการยืม
                      </button>
                    {booking.status === 'active' && !booking.issueReported && (
                      <button 
                        onClick={() => handleOpenReport(booking.id)}
                        className="px-4 py-2.5 bg-white border border-amber-200 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-50 hover:border-amber-300 transition flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        รายงานปัญหา
                      </button>
                    )}
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => onCancelBooking(booking.id)}
                        className="px-4 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:border-rose-300 transition flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <XCircle size={16} />
                        ยกเลิก
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
                {history.slice(0, 5).map(booking => (
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
                    <div className="text-right sm:text-right">
                      <span className="text-[11px] text-gray-500 font-medium bg-white px-2 py-1 rounded-lg border border-gray-100 inline-block">{booking.createdAt}</span>
                    </div>
                  </div>
                ))}
                {history.length > 5 && (
                  <button className="w-full py-3 mt-2 text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-xl transition">
                    ดูประวัติทั้งหมด ({history.length})
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
      {/* Ticket Modal */}
      {viewingTicket && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-sm relative"
          >
            {/* Close Button */}
            <button onClick={() => setViewingTicket(null)} className="absolute -top-12 right-0 text-white hover:text-gray-200 transition">
              <X size={28} />
            </button>

            {/* Ticket Container */}
            <div className="bg-white rounded-[2rem] shadow-2xl relative overflow-hidden">
              {/* Ticket Top / Header */}
              <div className="bg-slate-900 px-6 py-5 text-center text-white relative">
                <h3 className="font-bold text-lg">ตั๋วการยืมอุปกรณ์อย่างเป็นทางการ</h3>
                <p className="font-mono text-sm opacity-80 mt-1">Unique ID: {viewingTicket.ticketCode}</p>
                {/* Perforated Edge */}
                <div className="absolute -bottom-1 left-0 right-0 flex justify-around">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="w-2 h-2 rounded-full bg-white transform translate-y-1/2"></div>
                   ))}
                </div>
              </div>

              {/* Ticket Cutouts */}
              <div className="absolute top-24 -left-4 w-8 h-8 bg-gray-900/60 rounded-full"></div>
              <div className="absolute top-24 -right-4 w-8 h-8 bg-gray-900/60 rounded-full"></div>

              {/* Ticket Body */}
              <div className="p-8 pt-10 text-center relative">
                {/* User Info */}
                <div className="flex items-center gap-4 text-left border-b border-gray-100 pb-6 mb-6">
                   <div className="w-14 h-14 bg-emerald-50 rounded-full border-2 border-emerald-100 flex items-center justify-center overflow-hidden shrink-0">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-black text-[#397d54] uppercase">{user.name.substring(0, 2)}</span>
                      )}
                   </div>
                   <div>
                     <p className="text-xs font-bold text-gray-500 mb-0.5">ผู้ยืม</p>
                     <p className="text-base font-black text-gray-900">{user.name}</p>
                   </div>
                </div>

                {/* Equipment Info */}
                <div className="space-y-4 mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400 mb-2">
                     <Package size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900">{viewingTicket.equipmentName} <span className="text-gray-500">x{viewingTicket.quantity}</span></h4>
                    <p className={`text-sm font-bold mt-1 ${viewingTicket.status === 'pending' ? 'text-amber-600' : 'text-emerald-600'}`}>
                       สถานะ: {viewingTicket.status === 'pending' ? 'รออนุมัติ' : 'พร้อมรับ'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-left">
                     <p className="text-xs font-bold text-gray-700 flex justify-between"><span>สถานที่รับ:</span> <span className="text-gray-900">อาคารกิจกรรม ชั้น 1</span></p>
                     <p className="text-xs font-bold text-gray-700 flex justify-between mt-1"><span>จองเมื่อ:</span> <span className="text-gray-900">{viewingTicket.createdAt}</span></p>
                  </div>
                </div>
                
                <p className="text-xs font-bold text-gray-500 mt-8">กรุณาแสดงตั๋วนี้แก่เจ้าหน้าที่สโมสรเมื่อมารับอุปกรณ์</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
