import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Equipment, Booking, User } from '../types';
import { DEPARTMENTS } from '../data';
import { ClipboardCheck, QrCode, ArrowLeft, Send, Check, AlertTriangle, RefreshCw, Calendar, Trash2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface BookingFormProps {
  equipmentList: Equipment[];
  preselectedItem: Equipment | null;
  onClearPreselected: () => void;
  onBack: () => void;
  onSubmitBooking: (bookingData: Omit<Booking, 'id' | 'ticketCode' | 'createdAt' | 'status'>) => void;
  activeBookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  currentUser?: User | null;
}

export default function BookingForm({
  equipmentList,
  preselectedItem,
  onClearPreselected,
  onBack,
  onSubmitBooking,
  activeBookings,
  onCancelBooking,
  currentUser,
}: BookingFormProps) {
  const { t, language } = useSettings();
  // Form fields state
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [studentId, setStudentId] = useState(currentUser?.id || '');
  const [selectedDept, setSelectedDept] = useState(currentUser?.department || DEPARTMENTS[0]);
  const [selectedEqId, setSelectedEqId] = useState('');
  const [borrowQuantity, setBorrowQuantity] = useState<number>(1);
  const [returnTime, setReturnTime] = useState('');

  // Sync with current user changes
  useEffect(() => {
    if (currentUser) {
      setStudentName(currentUser.name);
      setStudentId(currentUser.id);
      if (currentUser.department) {
        setSelectedDept(currentUser.department);
      }
    }
  }, [currentUser]);


  // Selected item tracking
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [latestTicket, setLatestTicket] = useState<Booking | null>(null);

  // Sync with preselected item
  useEffect(() => {
    if (preselectedItem) {
      setSelectedEqId(preselectedItem.id);
      setSelectedItem(preselectedItem);
      setBorrowQuantity(1);
    } else if (equipmentList.length > 0) {
      setSelectedEqId(equipmentList[0].id);
      setSelectedItem(equipmentList[0]);
    }
  }, [preselectedItem, equipmentList]);

  // Sync selectedItem when selectedEqId changes manually
  useEffect(() => {
    const item = equipmentList.find((e) => e.id === selectedEqId);
    if (item) {
      setSelectedItem(item);
      if (borrowQuantity > item.availableStock) {
        setBorrowQuantity(item.availableStock > 0 ? 1 : 0);
      }
    }
  }, [selectedEqId, equipmentList]);

  // Default return time: 3 hours from now
  useEffect(() => {
    const defaultTime = new Date();
    defaultTime.setHours(defaultTime.getHours() + 3);
    const hours = String(defaultTime.getHours()).padStart(2, '0');
    const mins = String(defaultTime.getMinutes()).padStart(2, '0');
    setReturnTime(`${hours}:${mins}`);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!studentName.trim()) {
      setFormError('กรุณากรอกชื่อ-นามสกุลจริง');
      return;
    }
    if (!studentId.trim() || studentId.length < 8) {
      setFormError('กรุณากรอกรหัสนักศึกษาให้ถูกต้อง (อย่างน้อย 8 หลัก)');
      return;
    }
    if (!selectedEqId) {
      setFormError('กรุณาเลือกอุปกรณ์กีฬาที่ต้องการยืม');
      return;
    }
    if (!selectedItem) {
      setFormError('ไม่พบข้อมูลอุปกรณ์กีฬาที่ระบุ');
      return;
    }
    if (selectedItem.status === 'maintenance') {
      setFormError('ขออภัย อุปกรณ์ดังกล่าวอยู่ระหว่างปิดซ่อมบำรุง งดยืมชั่วคราว');
      return;
    }
    if (selectedItem.availableStock <= 0) {
      setFormError('ขออภัย อุปกรณ์กีฬาชนิดนี้หมดคลังชั่วคราว ไม่สามารถจองเพิ่มได้');
      return;
    }
    if (borrowQuantity <= 0) {
      setFormError('จำนวนที่ยืมต้องมากกว่า 0');
      return;
    }
    if (borrowQuantity > selectedItem.availableStock) {
      setFormError(`ไม่สามารถยืมจำนวนนี้ได้ มีอุปกรณ์ว่างให้ยืมเพียง ${selectedItem.availableStock} ชิ้น`);
      return;
    }
    if (!returnTime) {
      setFormError('กรุณากำหนดเวลาที่จะนำมาส่งคืนห้องสโมสรฯ');
      return;
    }

    // Prepare borrow date-time
    const now = new Date();
    const borrowTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;
    const returnTimeStr = `${returnTime} น.`;

    // Trigger parent callback
    onSubmitBooking({
      studentName,
      studentId,
      department: selectedDept,
      equipmentId: selectedEqId,
      equipmentName: selectedItem.thaiName,
      quantity: borrowQuantity,
      borrowTime: borrowTimeStr,
      returnTime: returnTimeStr,
    });

    // Reset simple values
    setBorrowQuantity(1);
    setBookingSuccess(true);
  };

  // Find latest active booking for this student
  useEffect(() => {
    if (bookingSuccess && activeBookings.length > 0) {
      // Find the booking just added (latest matching student ID)
      const matches = activeBookings.filter((b) => b.studentId === studentId);
      if (matches.length > 0) {
        setLatestTicket(matches[matches.length - 1]);
      }
    }
  }, [bookingSuccess, activeBookings, studentId]);

  const handleCreateNewBooking = () => {
    setBookingSuccess(false);
    setLatestTicket(null);
    onClearPreselected();
  };

  const getStatusStepClass = (bookingStatus: string, step: string) => {
    const stepOrder = ['pending', 'approved', 'active', 'returned'];
    const currentIdx = stepOrder.indexOf(bookingStatus);
    const stepIdx = stepOrder.indexOf(step);

    if (bookingStatus === 'rejected') {
      return step === 'pending' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-300';
    }

    if (currentIdx >= stepIdx) {
      return 'bg-[#397d54] text-white';
    }
    return 'bg-gray-100 text-gray-400 border border-gray-200';
  };

  const getStatusLabelText = (status: string) => {
    switch (status) {
      case 'pending': return t('สตาฟฟ์กำลังตรวจสอบ', 'Pending Staff Review');
      case 'approved': return t('อนุมัติ/พร้อมรับของ', 'Approved / Ready to Pick Up');
      case 'active': return t('กำลังยืมใช้งาน', 'Currently Borrowed');
      case 'returned': return t('คืนอุปกรณ์เรียบร้อย', 'Equipment Returned');
      case 'rejected': return t('ยกเลิก / ไม่อนุมัติ', 'Cancelled / Rejected');
      default: return t('ไม่ทราบสถานะ', 'Unknown Status');
    }
  };

  return (
    <div className="space-y-6" id="booking-engine-root">
      <AnimatePresence mode="wait">
        {!bookingSuccess ? (
          /* SECTION A: BOOKING FORM */
          <motion.div
            key="booking-form-panel"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            id="booking-form-grid"
          >
            {/* LEFT COLUMN: Equipment Details & History */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              
              {/* Equipment Preview Card */}
              <div className="bg-white border border-[#e3e3e4] rounded-2xl overflow-hidden shadow-sm">
                {selectedItem ? (
                  <>
                    <div className="h-48 bg-gray-100 relative">
                      <img src={selectedItem.image} alt={selectedItem.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <div className={`absolute top-3 right-3 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold ${selectedItem.availableStock > 0 ? 'bg-white/90 text-[#397d54]' : 'bg-rose-500/90 text-white'}`}>
                        {selectedItem.availableStock > 0 ? `${t('ว่าง', 'Available')} ${selectedItem.availableStock}` : t('หมด', 'Out of stock')}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#397d54] uppercase tracking-wider">
                          {selectedItem.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-lg font-black text-gray-900 leading-tight">
                          {language === 'th' ? selectedItem.thaiName : selectedItem.name}
                        </h3>
                        <div className="relative">
                          <select
                            value={selectedEqId}
                            onChange={(e) => setSelectedEqId(e.target.value)}
                            className="appearance-none pl-6 pr-6 py-1 bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold rounded-md focus:outline-none focus:ring-1 focus:ring-[#397d54] cursor-pointer"
                          >
                            <option value="" disabled>{t('เปลี่ยนอุปกรณ์', 'Change Equipment')}</option>
                            {equipmentList.map((eq) => (
                              <option key={eq.id} value={eq.id} disabled={eq.availableStock <= 0 || eq.status === 'maintenance'}>
                                {language === 'th' ? eq.thaiName : eq.name}
                              </option>
                            ))}
                          </select>
                          <RefreshCw size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                        {language === 'th' ? selectedItem.thaiDesc : selectedItem.desc}
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                           <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                           {t('สถานที่เก็บ:', 'Location:')} {selectedItem.location}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center p-6 text-center text-gray-400 bg-gray-50">
                    <ClipboardCheck size={32} className="mb-3 opacity-20" />
                    <p className="text-xs font-semibold">{t('กรุณาเลือกอุปกรณ์ทางขวามือ', 'Please select equipment on the right')}</p>
                  </div>
                )}
              </div>


            {/* Quick Summary Sidebar of My Bookings */}
            <div className="space-y-5 " id="my-booking-sidebar">
              <div className="bg-white border border-[#e3e3e4] rounded-2xl p-5 shadow-sm" id="sidebar-live-bookings">
                <h3 className="text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3 mb-3 flex items-center justify-between">
                  <span>{t('ประวัติคิวจองของคุณ', 'Your Booking History')}</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-extrabold">
                    {activeBookings.length} {t('รายการ', 'items')}
                  </span>
                </h3>

                {activeBookings.length > 0 ? (
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1" id="booking-sidebar-list">
                    {activeBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl border border-[#e3e3e4] bg-gray-50 relative overflow-hidden space-y-2.5 hover:border-gray-400 transition"
                        id={`sidebar-item-${b.id}`}
                      >
                        {/* Decor bar */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            b.status === 'pending'
                              ? 'bg-[#e0ac04]'
                              : b.status === 'approved' || b.status === 'active'
                              ? 'bg-[#397d54]'
                              : b.status === 'returned'
                              ? 'bg-blue-500'
                              : 'bg-rose-500'
                          }`}
                        ></div>

                        <div className="flex justify-between items-start pl-2" id={`sidebar-item-header-${b.id}`}>
                          <div>
                            <p className="font-extrabold text-xs text-gray-900">{b.equipmentName}</p>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase">{t('รหัสคิว:', 'Ticket:')} {b.ticketCode}</p>
                          </div>
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              b.status === 'pending'
                                ? 'bg-amber-100 text-[#e0ac04]'
                                : b.status === 'approved'
                                ? 'bg-emerald-100 text-[#397d54]'
                                : b.status === 'active'
                                ? 'bg-emerald-500 text-white'
                                : b.status === 'returned'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {b.status === 'pending' && t('รออนุมัติ', 'Pending')}
                            {b.status === 'approved' && t('อนุมัติแล้ว', 'Approved')}
                            {b.status === 'active' && t('กำลังยืม', 'Active')}
                            {b.status === 'returned' && t('คืนแล้ว', 'Returned')}
                            {b.status === 'rejected' && t('ปฏิเสธ', 'Rejected')}
                          </span>
                        </div>

                        <div className="pl-2 text-[10px] text-gray-500 grid grid-cols-2 gap-1.5 border-t border-gray-100 pt-2" id={`sidebar-item-body-${b.id}`}>
                          <div>
                            <p className="font-bold">{t('ผู้ยืม:', 'Borrower:')} {b.studentName}</p>
                            <p>{t('รหัส:', 'ID:')} {b.studentId}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{t('จำนวน:', 'Qty:')} {b.quantity} {t('ชิ้น', 'items')}</p>
                            <p className="text-gray-400">{t('เวลาคืน:', 'Return Time:')} {b.returnTime}</p>
                          </div>
                        </div>

                        {/* Cancellation Button for Pending and Approved bookings before they are marked active */}
                        {(b.status === 'pending' || b.status === 'approved') && (
                          <div className="pl-2 pt-1 flex justify-end" id={`cancel-box-${b.id}`}>
                            <button
                              onClick={() => onCancelBooking(b.id)}
                              className="text-[10px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 hover:underline"
                              id={`btn-cancel-${b.id}`}
                            >
                              <Trash2 size={11} />
                              {t('ยกเลิกคิวนี้', 'Cancel')}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10" id="sidebar-empty">
                    <p className="text-xs text-gray-400 font-medium">{t('ไม่มีรายการจองของคุณในขณะนี้', 'No bookings at this time')}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{t('กรอกฟอร์มด้านขวาเพื่อสร้างใบจองแรก', 'Fill the form to create your first booking')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* RIGHT COLUMN: The Booking Form (2 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white border border-[#e3e3e4] rounded-2xl p-6 shadow-sm space-y-6" id="form-container">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4" id="form-header">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    <ClipboardCheck className="text-[#397d54]" size={22} />
                    {t('ใบจองและยืมอุปกรณ์กีฬาออนไลน์', 'Online Equipment Booking Form')}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('กรอกข้อมูลนักศึกษาเพื่อทำการจองคิวรับของในห้องสโมสรวิทยาศาสตร์ฯ', 'Fill in your student information to reserve equipment at the Science Club.')}
                  </p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200 transition"
                    id="back-to-all-eq"
                  >
                    <ArrowLeft size={13} />
                    {t('ย้อนกลับ', 'Back')}
                  </button>
              </div>

              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-start gap-2.5" id="form-error-banner">
                  <AlertTriangle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" id="actual-borrow-form">
                {/* Name & ID Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="user-details-row">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">{t('ชื่อ-นามสกุล ผู้ยืม', 'Full Name')} {currentUser ? t('(เข้าสู่ระบบแล้ว)', '(Logged In)') : ''}</label>
                    <input
                      type="text"
                      placeholder={t('เช่น นายรักเรียน มั่นคง', 'e.g. Somchai Jaidee')}
                      value={studentName}
                      disabled={!!currentUser}
                      onChange={(e) => setStudentName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition ${
                        currentUser ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 font-bold' : 'bg-gray-50 border-[#e3e3e4]'
                      }`}
                      id="input-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">{t('รหัสนักศึกษา (Student ID)', 'Student ID')}</label>
                    <input
                      type="text"
                      placeholder={t('เช่น 660510123', 'e.g. 660510123')}
                      value={studentId}
                      disabled={!!currentUser}
                      onChange={(e) => setStudentId(e.target.value)}
                      className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition ${
                        currentUser ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 font-mono font-bold' : 'bg-gray-50 border-[#e3e3e4]'
                      }`}
                      id="input-id"
                    />
                  </div>
                </div>

                {/* Department Selection */}
                <div className="space-y-1.5" id="dept-select-row">
                  <label className="text-xs font-bold text-gray-700 block">{t('ภาควิชา / คณะวิทยาศาสตร์', 'Department / Faculty of Science')}</label>
                  <select
                    value={selectedDept}
                    disabled={!!currentUser}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition text-gray-700 ${
                      currentUser ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 font-medium' : 'bg-gray-50 border-[#e3e3e4]'
                    }`}
                    id="input-dept"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                                {/* Quantity Input */}
                <div className="space-y-1.5" id="eq-picker-row">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">{t('จำนวนที่ต้องการยืม', 'Quantity')}</label>
                    <div className="flex items-center" id="qty-input-controls">
                      <button
                        type="button"
                        onClick={() => setBorrowQuantity(prev => Math.max(1, prev - 1))}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-r-0 border-[#e3e3e4] rounded-l-xl text-xs font-extrabold"
                        id="qty-minus"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={selectedItem ? selectedItem.availableStock : 1}
                        value={borrowQuantity}
                        onChange={(e) => setBorrowQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full text-center py-2 bg-gray-50 border-y border-[#e3e3e4] text-xs font-bold focus:outline-none text-gray-800"
                        id="qty-input-field"
                      />
                      <button
                        type="button"
                        onClick={() => setBorrowQuantity(prev => {
                          const max = selectedItem ? selectedItem.availableStock : 99;
                          return Math.min(max, prev + 1);
                        })}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-l-0 border-[#e3e3e4] rounded-r-xl text-xs font-extrabold"
                        id="qty-plus"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Return Schedule Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" id="time-picker-row">
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
                    <Calendar className="text-[#397d54] flex-shrink-0" size={18} />
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase">{t('เวลายืมเริ่มต้น', 'Start Time')}</p>
                      <p className="text-xs font-bold text-gray-800">{t('ทันทีที่ได้รับอนุมัติใบจองจากสตาฟฟ์', 'As soon as approved by staff')}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">{t('เวลาคืนอุปกรณ์ (วันนี้)', 'Return Time (Today)')}</label>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-[#e3e3e4] rounded-xl text-xs font-bold focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition text-gray-700"
                      id="input-return-time"
                    />
                    <span className="text-[10px] text-gray-500 font-medium block">
                      {t('*กรุณาคืนภายในวันเดียวกัน ก่อนเวลาปิดทำการห้องสโมสรฯ (18:00 น.)', '*Please return within the same day before the club closes (18:00)')}
                    </span>
                  </div>
                </div>

                {/* Warning message if stock is limited */}
                {selectedItem && selectedItem.availableStock > 0 && selectedItem.availableStock <= 2 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 font-semibold flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#e0ac04]" />
                    <span>{t('แจ้งเตือน: อุปกรณ์ชิ้นนี้ใกล้หมดคลังแล้ว แนะนำให้รีบจองและไปรับที่สโมสรทันที!', 'Warning: This equipment is almost out of stock. Recommend booking and picking up immediately!')}</span>
                  </div>
                )}

                {/* Action Submit */}
                <div className="pt-4" id="submit-form-action">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#397d54] hover:bg-[#2e6242] text-white text-xs font-bold rounded-xl active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    id="btn-submit-booking"
                  >
                    <Send size={14} />
                    {t('ยืนยันคำขอจองอุปกรณ์ออนไลน์', 'Confirm Online Equipment Booking')}
                  </button>
                </div>
              </form>
            </div>

</motion.div>
        ) : (
          /* SECTION B: DIGITAL TICKET CONFIRMATION */
          <motion.div
            key="ticket-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto bg-white border border-[#e3e3e4] rounded-3xl overflow-hidden shadow-lg relative"
            id="ticket-card"
          >
            {/* Ticket Header Graphic */}
            <div className="bg-[#397d54] text-white p-6 text-center space-y-1 relative" id="ticket-header-strip">
              <div className="absolute top-4 left-4 bg-[#e0ac04] text-gray-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider" id="ticket-live-badge">
                LIVE TICKET
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-white/20">
                <Check className="text-[#e0ac04]" size={24} />
              </div>
              <h3 className="font-extrabold text-lg">{t('สโมสรนักศึกษา คณะวิทยาศาสตร์', 'Science Student Club')}</h3>
              <p className="text-xs text-emerald-100 font-light">{t('ระบบจองกีฬาและติดตามสถานะเรียลไทม์', 'Sports Booking & Real-time Tracking System')}</p>
            </div>

            {/* Ticket Content Body */}
            {latestTicket && (
              <div className="p-6 space-y-5" id="ticket-body">
                {/* Visual Booking Steps Indicator */}
                <div className="flex justify-between items-center px-4 relative" id="ticket-steps-flow">
                  {/* Progress Line */}
                  <div className="absolute left-6 right-6 top-4 h-[2px] bg-gray-200 -z-0"></div>
                  
                  {/* Step 1: Pending */}
                  <div className="flex flex-col items-center gap-1 z-10" id="step-col-pending">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getStatusStepClass(latestTicket.status, 'pending')}`}>
                      1
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold">{t('รอคิว', 'Pending')}</span>
                  </div>

                  {/* Step 2: Approved */}
                  <div className="flex flex-col items-center gap-1 z-10" id="step-col-approved">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getStatusStepClass(latestTicket.status, 'approved')}`}>
                      2
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold">{t('อนุมัติ', 'Approved')}</span>
                  </div>

                  {/* Step 3: Active */}
                  <div className="flex flex-col items-center gap-1 z-10" id="step-col-active">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getStatusStepClass(latestTicket.status, 'active')}`}>
                      3
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold">{t('กำลังใช้', 'Active')}</span>
                  </div>

                  {/* Step 4: Returned */}
                  <div className="flex flex-col items-center gap-1 z-10" id="step-col-returned">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getStatusStepClass(latestTicket.status, 'returned')}`}>
                      4
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold">{t('ส่งคืนแล้ว', 'Returned')}</span>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center" id="ticket-status-bar">
                  <span className="text-xs text-gray-500 font-medium">{t('สถานะตั๋ว:', 'Ticket Status:')}</span>
                  <span className="text-xs font-extrabold text-[#397d54] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e0ac04] inline-block"></span>
                    {getStatusLabelText(latestTicket.status)}
                  </span>
                </div>

                {/* Borrow Information Grid */}
                <div className="space-y-2.5 text-xs border-y border-[#e3e3e4] py-4" id="ticket-info-grid">
                  <div className="flex justify-between" id="ticket-info-code">
                    <span className="text-gray-400 font-medium">{t('รหัสการจอง:', 'Booking Code:')}</span>
                    <span className="font-extrabold text-gray-900 uppercase tracking-widest">{latestTicket.ticketCode}</span>
                  </div>
                  <div className="flex justify-between" id="ticket-info-eq">
                    <span className="text-gray-400 font-medium">{t('อุปกรณ์กีฬา:', 'Equipment:')}</span>
                    <span className="font-extrabold text-[#397d54] text-right">{latestTicket.equipmentName}</span>
                  </div>
                  <div className="flex justify-between" id="ticket-info-qty">
                    <span className="text-gray-400 font-medium">{t('จำนวนที่ขอยืม:', 'Quantity:')}</span>
                    <span className="font-extrabold text-gray-900">{latestTicket.quantity} {t('ชิ้น', 'items')}</span>
                  </div>
                  <div className="flex justify-between" id="ticket-info-name">
                    <span className="text-gray-400 font-medium">{t('ชื่อผู้ยืม:', 'Borrower Name:')}</span>
                    <span className="font-bold text-gray-800">{latestTicket.studentName} ({latestTicket.studentId})</span>
                  </div>
                  <div className="flex justify-between" id="ticket-info-dept">
                    <span className="text-gray-400 font-medium">{t('ภาควิชา:', 'Department:')}</span>
                    <span className="font-semibold text-gray-600 truncate max-w-[200px] text-right">{latestTicket.department}</span>
                  </div>
                  <div className="flex justify-between" id="ticket-info-schedule">
                    <span className="text-gray-400 font-medium">{t('ช่วงเวลายืม-คืน:', 'Borrowing Period:')}</span>
                    <span className="font-bold text-[#e0ac04]">{latestTicket.borrowTime} - {latestTicket.returnTime}</span>
                  </div>
                </div>

                {/* Fake Barcode/QR area for minimal sport feel */}
                <div className="bg-gray-50 border border-[#e3e3e4] p-4 rounded-2xl flex flex-col items-center justify-center space-y-2" id="ticket-barcode-area">
                  <QrCode size={48} className="text-gray-800" />
                  <p className="text-[9px] text-gray-400 font-mono">SCISPORT-BOOKING-{latestTicket.id.toUpperCase()}</p>
                  <p className="text-[10px] text-[#397d54] font-bold text-center leading-normal">
                    {t('*กรุณาแสดงหน้าจอหน้านี้ให้กับสตาฟฟ์ห้องสโมฯ', '*Please show this screen to the club staff')}
                    <br />{t('เพื่อรับอุปกรณ์ในเวลาที่จองไว้', 'to receive the reserved equipment')}
                  </p>
                </div>

                {/* Back button */}
                <div className="pt-2 flex gap-3" id="ticket-actions">
                  <button
                    onClick={handleCreateNewBooking}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                    id="btn-new-booking"
                  >
                    <RefreshCw size={12} />
                    {t('จองเพิ่มอีกรายการ', 'Book Another Item')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
