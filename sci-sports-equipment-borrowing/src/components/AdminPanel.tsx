import { useState } from 'react';
import { motion } from 'motion/react';
import { Booking, Equipment } from '../types';
import { Shield, Check, X, Undo2, AlertCircle, Wrench, RefreshCw, Layers } from 'lucide-react';

interface AdminPanelProps {
  bookings: Booking[];
  equipment: Equipment[];
  onApproveBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string) => void;
  onPickupBooking: (bookingId: string) => void;
  onReturnBooking: (bookingId: string) => void;
  onToggleMaintenance: (equipmentId: string) => void;
}

export default function AdminPanel({
  bookings,
  equipment,
  onApproveBooking,
  onRejectBooking,
  onPickupBooking,
  onReturnBooking,
  onToggleMaintenance,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'history'>('pending');

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  // Approved + Active means items are in transition or currently on field
  const currentActiveBorrows = bookings.filter((b) => b.status === 'approved' || b.status === 'active');
  const finishedBookings = bookings.filter((b) => b.status === 'returned' || b.status === 'rejected');

  return (
    <div className="space-y-6" id="admin-panel-root">
      {/* Admin Header with Banner */}
      <div className="bg-gray-900 text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm" id="admin-header-banner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#397d54] rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-extrabold flex items-center gap-1.5">
              ระบบสตาฟฟ์สโมสรนักศึกษา (Staff Control Room)
            </h2>
            <p className="text-xs text-gray-400">
              จัดการใบจองอนุมัติ อัพเดทรับคืนอุปกรณ์ และบริหารซ่อมบำรุงในห้องสโมสรฯ คณะวิทยาศาสตร์
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-gray-800 text-gray-300 font-bold px-3 py-1.5 rounded-xl border border-gray-700">
          <Layers size={13} className="text-[#e0ac04]" />
          <span>จำลองการเป็น: <span className="text-[#e0ac04]">Staff Admin</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="admin-main-grid">
        {/* Left Side: Booking Approval Station (2 cols) */}
        <div className="lg:col-span-2 space-y-4" id="admin-booking-station">
          {/* Booking Navigation Tabs */}
          <div className="flex border-b border-[#e3e3e4] gap-2" id="admin-tabs-list">
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-2 text-xs font-bold transition-all relative ${
                activeTab === 'pending'
                  ? 'text-[#397d54]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              id="tab-admin-pending"
            >
              ใบจองรออนุมัติ ({pendingBookings.length})
              {activeTab === 'pending' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#397d54]" id="tab-active-indicator-pending"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`pb-3 px-2 text-xs font-bold transition-all relative ${
                activeTab === 'active'
                  ? 'text-[#397d54]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              id="tab-admin-active"
            >
              กำลังยืม / อนุมัติแล้ว ({currentActiveBorrows.length})
              {activeTab === 'active' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#397d54]" id="tab-active-indicator-active"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-2 text-xs font-bold transition-all relative ${
                activeTab === 'history'
                  ? 'text-[#397d54]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              id="tab-admin-history"
            >
              ประวัติเสร็จสิ้น ({finishedBookings.length})
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#397d54]" id="tab-active-indicator-history"></div>
              )}
            </button>
          </div>

          {/* Bookings List by activeTab */}
          <div className="space-y-3" id="admin-bookings-rendered-list">
            {activeTab === 'pending' && (
              pendingBookings.length > 0 ? (
                pendingBookings.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-white border border-amber-200 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                    id={`admin-pending-item-${b.id}`}
                  >
                    {/* Left amber status band */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#e0ac04]"></div>

                    <div className="pl-2 space-y-1.5" id={`pending-info-${b.id}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">{b.equipmentName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-[#e0ac04] rounded-md border border-amber-100 uppercase tracking-wider">
                          คิว: {b.ticketCode}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        ผู้ยืม: <span className="text-gray-800 font-bold">{b.studentName}</span> | รหัส: <span className="text-gray-800 font-mono">{b.studentId}</span> | ภาควิชา: {b.department}
                      </p>
                      <p className="text-[11px] text-[#397d54] font-bold">
                        จำนวนที่ขอ: {b.quantity} ชิ้น | กำหนดคืน: {b.returnTime} (วันนี้)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pl-2 md:pl-0" id={`pending-actions-${b.id}`}>
                      <button
                        onClick={() => onApproveBooking(b.id)}
                        className="px-3.5 py-1.5 bg-[#397d54] hover:bg-[#2e6242] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        id={`btn-approve-${b.id}`}
                      >
                        <Check size={14} />
                        อนุมัติยืม
                      </button>
                      <button
                        onClick={() => onRejectBooking(b.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                        id={`btn-reject-${b.id}`}
                      >
                        <X size={14} />
                        ปฏิเสธ
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white border border-[#e3e3e4] rounded-2xl" id="pending-empty">
                  <AlertCircle size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 font-medium">ไม่มีใบจองรอคิวอนุมัติในขณะนี้</p>
                </div>
              )
            )}

            {activeTab === 'active' && (
              currentActiveBorrows.length > 0 ? (
                currentActiveBorrows.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-white border border-[#e3e3e4] rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                    id={`admin-active-item-${b.id}`}
                  >
                    {/* Left status band (green) */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#397d54]"></div>

                    <div className="pl-2 space-y-1.5" id={`active-info-${b.id}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900">{b.equipmentName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                          รหัสยืม: {b.ticketCode}
                        </span>
                        {b.status === 'approved' ? (
                          <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                            อนุมัติแล้ว (รอรับของ)
                          </span>
                        ) : (
                          <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                            กำลังเล่นกีฬาอยู่
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        ผู้ยืม: <span className="text-gray-800 font-bold">{b.studentName}</span> | รหัส: <span className="text-gray-800 font-mono">{b.studentId}</span>
                      </p>
                      <p className="text-[11px] text-[#397d54] font-bold">
                        จำนวน: {b.quantity} ชิ้น | กำหนดคืน: {b.returnTime} (วันนี้)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pl-2 md:pl-0" id={`active-actions-${b.id}`}>
                      {b.status === 'approved' ? (
                        <button
                          onClick={() => onPickupBooking(b.id)}
                          className="px-3.5 py-1.5 bg-[#e0ac04] hover:bg-[#c99a03] text-gray-900 text-xs font-black rounded-lg transition flex items-center gap-1 cursor-pointer"
                          id={`btn-pickup-${b.id}`}
                        >
                          <Check size={14} />
                          สโมสรฯ ส่งมอบของแล้ว
                        </button>
                      ) : (
                        <button
                          onClick={() => onReturnBooking(b.id)}
                          className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                          id={`btn-return-${b.id}`}
                        >
                          <Undo2 size={14} />
                          รับคืนอุปกรณ์และเพิ่มสต็อก
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 bg-white border border-[#e3e3e4] rounded-2xl" id="active-empty">
                  <AlertCircle size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 font-medium">ไม่มีอุปกรณ์กีฬาที่กำลังถูกยืมใช้งานอยู่</p>
                </div>
              )
            )}

            {activeTab === 'history' && (
              finishedBookings.length > 0 ? (
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1" id="admin-history-scroll">
                  {finishedBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center text-xs"
                      id={`admin-history-item-${b.id}`}
                    >
                      <div className="space-y-1" id={`hist-info-${b.id}`}>
                        <p className="font-extrabold text-gray-800">
                          {b.equipmentName} ({b.quantity} ชิ้น)
                        </p>
                        <p className="text-[10px] text-gray-400">
                          รหัส: {b.ticketCode} | ผู้ยืม: {b.studentName} ({b.studentId})
                        </p>
                      </div>
                      <div className="text-right" id={`hist-badge-${b.id}`}>
                        <span
                          className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            b.status === 'returned'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {b.status === 'returned' ? 'ส่งคืนแล้ว' : 'ปฏิเสธ/ยกเลิก'}
                        </span>
                        <p className="text-[9px] text-gray-400 mt-1">เวลาคืนเป้าหมาย: {b.returnTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white border border-[#e3e3e4] rounded-2xl" id="history-empty">
                  <AlertCircle size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 font-medium">ไม่มีประวัติรายการจองเสร็จสิ้นย้อนหลัง</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Right Side: Maintenance Control Grid (1 col) */}
        <div className="lg:col-span-1 bg-white border border-[#e3e3e4] rounded-2xl p-5 shadow-sm space-y-4" id="admin-maintenance-control">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Wrench size={16} className="text-rose-600" />
              จัดการสถานะ / ส่งซ่อมอุปกรณ์
            </h3>
            <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
              สตาฟฟ์สามารถกดทำเครื่องหมาย ส่งซ่อมบำรุง เพื่อเปลี่ยนสถานะเป็น <span className="text-rose-600 font-semibold">Maintenance</span> ซึ่งจะดึงสินค้าตัวนี้ออกจากสต็อกให้บริการทันทีแบบเรียลไทม์
            </p>
          </div>

          <div className="space-y-3 pt-2" id="admin-maintenance-list">
            {equipment.map((item) => {
              const isMaintenance = item.status === 'maintenance';

              return (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-200"
                  id={`maintenance-item-${item.id}`}
                >
                  <div id={`maint-info-${item.id}`}>
                    <p className="text-xs font-extrabold text-gray-800 leading-normal">{item.thaiName}</p>
                    <p className="text-[9px] text-gray-400 font-mono">คงเหลือใช้งานได้: {item.availableStock}/{item.totalStock} ชิ้น</p>
                  </div>
                  <button
                    onClick={() => onToggleMaintenance(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition flex items-center gap-1 cursor-pointer ${
                      isMaintenance
                        ? 'bg-rose-600 text-white hover:bg-rose-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    id={`btn-maint-toggle-${item.id}`}
                  >
                    <Wrench size={10} />
                    {isMaintenance ? 'นำออกจากซ่อม' : 'ส่งซ่อมบำรุง'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
