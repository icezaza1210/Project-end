import React from 'react';
import { User, Booking } from '../types';
import { User as UserIcon, Calendar, CheckCircle2, Clock, XCircle, ChevronRight, Package, ArrowLeft } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface StudentProfileProps {
  user: User;
  bookings: Booking[];
  onNavigateCatalog: () => void;
  onCancelBooking: (bookingId: string) => void;
}

export default function StudentProfile({ user, bookings, onNavigateCatalog, onCancelBooking }: StudentProfileProps) {
  const { t } = useSettings();
  const userBookings = bookings.filter(b => b.studentId === user.id);
  
  const pending = userBookings.filter(b => b.status === 'pending');
  const approved = userBookings.filter(b => b.status === 'approved' || b.status === 'active');
  const history = userBookings.filter(b => b.status === 'returned' || b.status === 'rejected');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-1 rounded-full uppercase">รออนุมัติ</span>;
      case 'approved':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-1 rounded-full uppercase">อนุมัติแล้ว</span>;
      case 'active':
        return <span className="bg-emerald-100 text-[#397d54] text-[10px] font-black px-2 py-1 rounded-full uppercase">กำลังใช้งาน</span>;
      case 'returned':
        return <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-1 rounded-full uppercase">คืนแล้ว</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-1 rounded-full uppercase">ปฏิเสธ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex items-center justify-center shadow-inner">
          <span className="text-4xl font-black text-[#397d54]">{user.name.substring(0, 2)}</span>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{user.name}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold font-mono tracking-wide flex items-center gap-1.5">
              <UserIcon size={14} /> ID: {user.id}
            </span>
            <span className="px-3 py-1 bg-[#397d54]/10 text-[#397d54] rounded-lg text-xs font-black uppercase">
              {user.role === 'staff' ? 'สตาฟฟ์สโมสรฯ' : 'นักศึกษา'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-[#397d54]" />
              สถานะการจองปัจจุบัน
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl border border-amber-100/50">
                <span className="text-xs font-bold text-amber-800">รออนุมัติ</span>
                <span className="text-xl font-black text-amber-600">{pending.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100/50">
                <span className="text-xs font-bold text-[#397d54]">กำลังยืม/ใช้งาน</span>
                <span className="text-xl font-black text-[#397d54]">{approved.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bookings List */}
        <div className="md:col-span-2 space-y-6">
          {/* Active Bookings */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-[#397d54]" />
              รายการที่กำลังดำเนินการ
            </h3>
            {pending.length === 0 && approved.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-sm font-bold text-gray-500">คุณไม่มีรายการจองที่กำลังดำเนินการ</p>
                <button 
                  onClick={onNavigateCatalog}
                  className="mt-4 px-4 py-2 bg-[#397d54] text-white rounded-xl text-xs font-bold hover:bg-[#2c5f3f] transition"
                >
                  ไปจองอุปกรณ์เลย
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[...pending, ...approved].map(booking => (
                  <div key={booking.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-500">{booking.ticketCode}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <h4 className="font-bold text-gray-900">{booking.equipmentName}</h4>
                      <p className="text-[11px] text-gray-500">จำนวน: {booking.quantity} ชิ้น • สร้างเมื่อ: {booking.createdAt}</p>
                    </div>
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => onCancelBooking(booking.id)}
                        className="px-3 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 transition"
                      >
                        ยกเลิกคิว
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-gray-500" />
                ประวัติย้อนหลัง
              </h3>
              <div className="space-y-3">
                {history.map(booking => (
                  <div key={booking.id} className="p-3 rounded-xl border border-gray-100 bg-white flex items-center justify-between opacity-70 hover:opacity-100 transition">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] font-bold text-gray-400">{booking.ticketCode}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-xs font-bold text-gray-700">{booking.equipmentName}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">{booking.createdAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
