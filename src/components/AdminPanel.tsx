import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, Equipment } from '../types';
import { Shield, Check, X, Undo2, AlertCircle, Wrench, RefreshCw, Layers, Search, Package, Plus, Minus, Filter } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { formatBookingDateTime } from '../lib/format';

interface AdminPanelProps {
  bookings: Booking[];
  equipment: Equipment[];
  onApproveBooking: (bookingId: string) => void;
  onRejectBooking: (bookingId: string) => void;
  onPickupBooking: (bookingId: string) => void;
  onReturnBooking: (bookingId: string) => void;
  onToggleMaintenance: (equipmentId: string) => void;
  onUpdateStock?: (equipmentId: string, newTotal: number) => void;
  usersDb?: any[];
  penaltyLogs?: any[];
  onUpdateUserStatus?: (userId: string, penaltyDelta: number, isBlacklisted: boolean, reason: string) => void;
  onResolveIssue?: (bookingId: string) => void;
}

export default function AdminPanel({
  bookings,
  equipment,
  onApproveBooking,
  onRejectBooking,
  onPickupBooking,
  onReturnBooking,
  onToggleMaintenance,
  onUpdateStock,
  usersDb = [],
  penaltyLogs = [],
  onUpdateUserStatus,
  onResolveIssue
}: AdminPanelProps) {
  const { t, language } = useSettings();
  const [mainTab, setMainTab] = useState<'bookings' | 'inventory' | 'users'>('bookings');
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'history'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [penaltyReason, setPenaltyReason] = useState('');
  const [penaltyAmount, setPenaltyAmount] = useState<number>(10);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const currentActiveBorrows = bookings.filter((b) => b.status === 'approved' || b.status === 'active');
  const finishedBookings = bookings.filter((b) => b.status === 'returned' || b.status === 'rejected');

  const getFilteredBookings = (list: Booking[]) => {
    if (!searchQuery) return list;
    const lowerQ = searchQuery.toLowerCase();
    return list.filter(b => 
      b.studentName.toLowerCase().includes(lowerQ) || 
      b.studentId.toLowerCase().includes(lowerQ) ||
      b.ticketCode.toLowerCase().includes(lowerQ) ||
      b.equipmentName.toLowerCase().includes(lowerQ)
    );
  };

  const filteredUsers = usersDb.filter(u => {
    if (!userSearchQuery) return true;
    const lowerQ = userSearchQuery.toLowerCase();
    return u.name.toLowerCase().includes(lowerQ) || u.id.toLowerCase().includes(lowerQ);
  });

  const filteredPending = getFilteredBookings(pendingBookings);
  const filteredActive = getFilteredBookings(currentActiveBorrows);
  const filteredHistory = getFilteredBookings(finishedBookings);

  return (
    <div className="space-y-6" id="admin-panel-root">
      {/* Admin Header with Banner */}
      <div className="bg-gray-900 text-white p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm" id="admin-header-banner">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#397d54] rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black flex items-center gap-2">
              {t('ระบบจัดการสโมสรนักศึกษา', 'Science Club Admin System')}
              <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30 uppercase tracking-wider">Staff Only</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {t('จัดการใบจอง อัพเดทสถานะรับคืนอุปกรณ์ และบริหารคลังสินค้า', 'Manage bookings, returns, and inventory.')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-gray-800 text-gray-300 font-bold px-4 py-2 rounded-xl border border-gray-700">
          <Layers size={14} className="text-[#e0ac04]" />
          <span>{t('ผู้ดูแลระบบ:', 'Admin:')} <span className="text-[#e0ac04]">Staff Admin</span></span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setMainTab('bookings')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mainTab === 'bookings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <RefreshCw size={16} className={mainTab === 'bookings' ? 'text-[#397d54]' : ''} />
          {t('จัดการใบจอง', 'Bookings')}
        </button>
        <button
          onClick={() => setMainTab('inventory')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mainTab === 'inventory' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Package size={16} className={mainTab === 'inventory' ? 'text-[#397d54]' : ''} />
          {t('คลังอุปกรณ์', 'Inventory')}
        </button>
        <button
          onClick={() => setMainTab('users')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mainTab === 'users' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Shield size={16} className={mainTab === 'users' ? 'text-[#397d54]' : ''} />
          {t('ผู้ใช้งาน', 'Users')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mainTab === 'bookings' && (
          <motion.div
            key="tab-bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Bookings Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 w-full md:w-auto">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-[#e0ac04] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t('รออนุมัติ', 'Pending')} <span className="ml-1 bg-gray-100 px-1.5 rounded text-[10px]">{pendingBookings.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'active' ? 'bg-white text-[#397d54] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t('กำลังยืม', 'Active')} <span className="ml-1 bg-gray-100 px-1.5 rounded text-[10px]">{currentActiveBorrows.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t('ประวัติ', 'History')} <span className="ml-1 bg-gray-100 px-1.5 rounded text-[10px]">{finishedBookings.length}</span>
                </button>
              </div>

              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder={t('ค้นหารหัสผู้ยืม, ชื่อ, ทิคเก็ต...', 'Search ID, Name, Ticket...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {activeTab === 'pending' && (
                filteredPending.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredPending.map((b) => (
                      <div key={b.id} className="p-5 bg-white border border-amber-200 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#e0ac04]"></div>
                        <div>
                          <div className="flex justify-between items-start mb-3 pl-2">
                            <div>
                              <span className="font-extrabold text-sm text-gray-900 block mb-1">{b.equipmentName}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-[#e0ac04] rounded-md border border-amber-100 uppercase tracking-wider">
                                {t('คิว:', 'Ticket:')} {b.ticketCode}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-black text-[#e0ac04]">{b.quantity}</span>
                              <span className="text-[10px] text-gray-500 ml-1 font-bold">{t('ชิ้น', 'items')}</span>
                            </div>
                          </div>
                          <div className="pl-2 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                            <p className="text-xs text-gray-600">
                              <span className="font-bold text-gray-800">{b.studentName}</span> ({b.studentId})
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">{b.department}</p>
                            <p className="text-[10px] text-gray-500 font-medium pt-1 border-t border-gray-200 mt-1">
                              {t('เวลารับ-คืน:', 'Period:')} <span className="text-gray-800 font-bold">{b.borrowTime} - {b.returnTime}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pl-2">
                          <button
                            onClick={() => onApproveBooking(b.id)}
                            className="flex-1 py-2 bg-[#397d54] hover:bg-[#2e6242] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Check size={14} />
                            {t('อนุมัติ', 'Approve')}
                          </button>
                          <button
                            onClick={() => onRejectBooking(b.id)}
                            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition flex items-center justify-center border border-rose-100"
                            title={t('ปฏิเสธ', 'Reject')}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title={t('ไม่มีใบจองรออนุมัติ', 'No pending bookings')} />
                )
              )}

              {activeTab === 'active' && (
                filteredActive.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredActive.map((b) => (
                      <div key={b.id} className="p-5 bg-white border border-[#397d54]/30 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#397d54]"></div>
                        <div>
                          <div className="flex justify-between items-start mb-3 pl-2">
                            <div>
                              <span className="font-extrabold text-sm text-gray-900 block mb-1">{b.equipmentName}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md border border-gray-200">
                                  {b.ticketCode}
                                </span>
                                {b.status === 'approved' ? (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
                                    {t('รอรับของ', 'Waiting Pickup')}
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                                    {t('กำลังเล่นอยู่', 'Active')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-black text-[#397d54]">{b.quantity}</span>
                              <span className="text-[10px] text-gray-500 ml-1 font-bold">{t('ชิ้น', 'items')}</span>
                            </div>
                          </div>
                          <div className="pl-2 space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                            <p className="text-xs text-gray-600">
                              <span className="font-bold text-gray-800">{b.studentName}</span> ({b.studentId})
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium pt-1 border-t border-gray-200 mt-1">
                              {t('กำหนดคืน:', 'Due:')} <span className="text-rose-600 font-bold">{b.returnTime}</span>
                            </p>
                          </div>
                        </div>
                        <div className="pl-2">
                          {b.status === 'approved' ? (
                            <button
                              onClick={() => onPickupBooking(b.id)}
                              className="w-full py-2 bg-[#e0ac04] hover:bg-[#c99a03] text-gray-900 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Check size={14} />
                              {t('ยืนยันการรับอุปกรณ์', 'Confirm Pickup')}
                            </button>
                          ) : (
                            <button
                              onClick={() => onReturnBooking(b.id)}
                              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Undo2 size={14} />
                              {t('รับคืนเข้าสต็อก', 'Receive Return')}
                            </button>
                          )}
                          {b.issueReported && b.issueStatus === 'pending' && (
                            <button
                              onClick={() => onResolveIssue && onResolveIssue(b.id)}
                              className="w-full mt-2 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <AlertCircle size={14} />
                              รับทราบปัญหา ({b.issueDetails})
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title={t('ไม่มีอุปกรณ์กำลังถูกใช้งาน', 'No active equipment')} />
                )
              )}

              {activeTab === 'history' && (
                filteredHistory.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase text-gray-500 font-black tracking-wider">
                            <th className="p-4">{t('คิว/เวลา', 'Ticket/Time')}</th>
                            <th className="p-4">{t('อุปกรณ์', 'Equipment')}</th>
                            <th className="p-4">{t('ผู้ยืม', 'Borrower')}</th>
                            <th className="p-4 text-right">{t('สถานะ', 'Status')}</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs divide-y divide-gray-100">
                          {filteredHistory.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <span className="font-mono font-bold text-gray-800">{b.ticketCode}</span>
                                <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                                  {formatBookingDateTime(b.createdAt || b.borrowTime)}
                                </div>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-gray-900">{b.equipmentName}</span>
                                <span className="ml-1 text-[10px] text-gray-500">x{b.quantity}</span>
                              </td>
                              <td className="p-4 text-gray-600">
                                {b.studentName}
                                <div className="text-[10px] text-gray-400 mt-0.5">{b.studentId}</div>
                              </td>
                              <td className="p-4 text-right">
                                <span
                                  className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                                    b.status === 'returned'
                                      ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                                  }`}
                                >
                                  {b.status === 'returned' ? t('คืนแล้ว', 'Returned') : t('ยกเลิก', 'Cancelled')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <EmptyState title={t('ไม่มีประวัติย้อนหลัง', 'No history')} />
                )
              )}
            </div>
          </motion.div>
        )}

        {mainTab === 'inventory' && (
          <motion.div
            key="tab-inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">{t('จัดการคลังอุปกรณ์', 'Inventory Management')}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t('เพิ่ม/ลดจำนวนสต็อกและเปลี่ยนสถานะซ่อมบำรุง', 'Adjust stock levels and toggle maintenance.')}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.map((item) => {
                  const isMaintenance = item.status === 'maintenance';
                  return (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-2xl hover:border-[#397d54]/30 transition-colors bg-gray-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm text-gray-900 leading-tight">{language === 'th' ? item.thaiName : item.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-bold uppercase tracking-wider">{item.category}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mb-4 truncate">{item.location}</p>
                      
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-600">{t('สต็อกรวม:', 'Total:')}</span>
                          <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                            <button
                              onClick={() => onUpdateStock && onUpdateStock(item.id, Math.max(1, item.totalStock - 1))}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-gray-900">{item.totalStock}</span>
                            <button
                              onClick={() => onUpdateStock && onUpdateStock(item.id, item.totalStock + 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => onToggleMaintenance(item.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                            isMaintenance ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-white text-gray-400 border border-gray-200 hover:text-rose-500 hover:border-rose-200'
                          }`}
                          title={isMaintenance ? t('นำออกจากซ่อม', 'End Maintenance') : t('ส่งซ่อมบำรุง', 'Send to Maintenance')}
                        >
                          <Wrench size={14} />
                        </button>
                      </div>
                      
                      <div className="mt-2 text-[10px] font-medium text-gray-500 flex justify-between">
                        <span>{t('ว่างใช้งาน:', 'Available:')} <span className="font-bold text-[#397d54]">{item.availableStock}</span></span>
                        {isMaintenance && <span className="text-rose-600 font-bold">{t('ซ่อมบำรุง', 'Maintenance')}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {mainTab === 'users' && (
          <motion.div
            key="tab-users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-gray-900">จัดการผู้ใช้งาน & บทลงโทษ</h3>
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหา ID หรือ ชื่อนักศึกษา..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#397d54]/20 focus:border-[#397d54]"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 font-bold text-gray-500">ID</th>
                    <th className="pb-3 font-bold text-gray-500">ชื่อ - สกุล</th>
                    <th className="pb-3 font-bold text-gray-500">บทบาท</th>
                    <th className="pb-3 font-bold text-gray-500 text-center">แต้มหัก</th>
                    <th className="pb-3 font-bold text-gray-500 text-center">สถานะ</th>
                    <th className="pb-3 font-bold text-gray-500 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map(u => {
                    const isSuspended = u.suspendedUntil && u.suspendedUntil > Date.now();
                    return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedUser(u)}>
                      <td className="py-4 font-mono text-xs">{u.id}</td>
                      <td className="py-4 font-bold text-gray-900">{u.name} <span className="text-xs font-normal text-gray-500 block">{u.department}</span></td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${u.role === 'staff' ? 'bg-[#397d54] text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`font-black ${u.penaltyPoints >= 100 ? 'text-rose-600' : 'text-gray-400'}`}>
                          {u.penaltyPoints || 0}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        {u.isBlacklisted ? (
                           <span className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded uppercase">Blacklisted</span>
                        ) : isSuspended ? (
                           <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">Suspended</span>
                        ) : (
                           <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200">
                          จัดการ
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected User Modal / Panel */}
            <AnimatePresence>
              {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                  >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black text-gray-900">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-500">{selectedUser.id} • {selectedUser.department}</p>
                      </div>
                      <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-bold mb-1">คะแนนสะสม</p>
                          <p className={`text-2xl font-black ${selectedUser.penaltyPoints >= 100 ? 'text-rose-600' : 'text-gray-900'}`}>{selectedUser.penaltyPoints || 0} pts</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-bold mb-1">สถานะ</p>
                          {selectedUser.isBlacklisted ? (
                            <p className="text-rose-600 font-black flex items-center gap-2"><X size={16} /> แบล็คลิสต์ถาวร</p>
                          ) : (selectedUser.suspendedUntil && selectedUser.suspendedUntil > Date.now()) ? (
                            <p className="text-amber-600 font-black flex items-center gap-2">ระงับถึง {new Date(selectedUser.suspendedUntil).toLocaleDateString('th-TH')}</p>
                          ) : (
                            <p className="text-emerald-600 font-black flex items-center gap-2"><Check size={16} /> ปกติ</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
                        <h4 className="font-bold text-rose-900 mb-3 flex items-center gap-2"><AlertCircle size={16} /> ลงโทษผู้ใช้งาน</h4>
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="ระบุเหตุผล เช่น ส่งคืนล่าช้า, ทำอุปกรณ์เสียหาย..." 
                            value={penaltyReason}
                            onChange={(e) => setPenaltyReason(e.target.value)}
                            className="w-full px-4 py-2 border border-rose-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20"
                          />
                          <div className="flex gap-2">
                             <input 
                              type="number" 
                              value={penaltyAmount}
                              onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                              className="w-24 px-4 py-2 border border-rose-200 rounded-xl text-sm font-bold"
                             />
                             <button 
                               onClick={() => {
                                 if(!penaltyReason) return alert('กรุณาระบุเหตุผล');
                                 if(onUpdateUserStatus) onUpdateUserStatus(selectedUser.id, penaltyAmount, selectedUser.isBlacklisted, penaltyReason);
                                 setPenaltyReason('');
                               }}
                               className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm"
                             >
                               บันทึกหักคะแนน
                             </button>
                             {!selectedUser.isBlacklisted && (
                               <button 
                                 onClick={() => {
                                   if(confirm('ยืนยันแบนถาวรผู้ใช้นี้ทันทีหรือไม่?')) {
                                     if(onUpdateUserStatus) onUpdateUserStatus(selectedUser.id, 0, true, 'แบนฉุกเฉิน: ' + penaltyReason);
                                   }
                                 }}
                                 className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-xl text-sm flex-1"
                               >
                                 แบนถาวรทันที (ฉุกเฉิน)
                               </button>
                             )}
                             {selectedUser.isBlacklisted && (
                               <button 
                                 onClick={() => {
                                   if(confirm('ยืนยันปลดแบนผู้ใช้นี้หรือไม่?')) {
                                     if(onUpdateUserStatus) onUpdateUserStatus(selectedUser.id, 0, false, 'ปลดแบล็คลิสต์');
                                   }
                                 }}
                                 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex-1"
                               >
                                 ปลดแบล็คลิสต์ & รีเซ็ตคะแนน
                               </button>
                             )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">ประวัติความประพฤติ</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          {penaltyLogs.filter(l => l.studentId === selectedUser.id).length > 0 ? penaltyLogs.filter(l => l.studentId === selectedUser.id).map(log => (
                            <div key={log.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-start">
                              <div>
                                <p className="text-xs font-bold text-gray-900">{log.actionTaken} {log.pointsAdded > 0 ? `(+${log.pointsAdded})` : ''}</p>
                                <p className="text-[11px] text-gray-600 mt-0.5">เหตุผล: {log.reason || '-'}</p>
                                <p className="text-[10px] text-gray-400 mt-1">โดยสตาฟฟ์ {log.adminId} • {new Date(log.timestamp).toLocaleString('th-TH')}</p>
                              </div>
                            </div>
                          )) : (
                            <p className="text-xs text-gray-500 italic">ไม่มีประวัติการทำผิด</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-300 rounded-2xl">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
        <AlertCircle size={24} className="text-gray-400" />
      </div>
      <h3 className="text-sm font-extrabold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">Everything is caught up.</p>
    </div>
  );
}
