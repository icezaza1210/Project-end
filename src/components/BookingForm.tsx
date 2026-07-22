import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Equipment, Booking, User } from '../types';
import { DEPARTMENTS } from '../data';
import { ClipboardCheck, QrCode, ArrowLeft, Send, Check, AlertTriangle, RefreshCw, Calendar, Trash2, X, Repeat, Box } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
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
  const [studentName, setStudentName] = useState(currentUser?.name || '');

  const renderSportIcon = (iconName: string, category: string, size = 20) => {
    const IconComponent = (LucideIcons as any)[iconName] || Box;
    
    let bgColor = "bg-gray-100 text-gray-600";
    if (iconName === 'Activity' || iconName === 'Compass') {
      bgColor = "bg-emerald-100 text-emerald-600";
    } else if (iconName === 'Sword') {
      bgColor = "bg-indigo-100 text-indigo-600";
    } else if (iconName === 'Disc') {
      bgColor = "bg-blue-100 text-blue-600";
    } else if (iconName === 'Dribbble') {
      bgColor = "bg-amber-100 text-amber-700";
    } else if (iconName === 'Target') {
      bgColor = "bg-slate-200 text-slate-700";
    }
    
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor} shrink-0`}>
        <IconComponent size={size} />
      </div>
    );
  };

  const renderSportIconLarge = (iconName: string, category: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Box;
    
    let bgColor = "bg-gray-100 text-gray-600";
    if (iconName === 'Activity' || iconName === 'Compass') {
      bgColor = "bg-emerald-100 text-emerald-600";
    } else if (iconName === 'Sword') {
      bgColor = "bg-indigo-100 text-indigo-600";
    } else if (iconName === 'Disc') {
      bgColor = "bg-blue-100 text-blue-600";
    } else if (iconName === 'Dribbble') {
      bgColor = "bg-amber-100 text-amber-700";
    } else if (iconName === 'Target') {
      bgColor = "bg-slate-200 text-slate-700";
    }
    
    return (
      <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm ${bgColor} shrink-0`}>
        <IconComponent size={40} />
      </div>
    );
  };
  const [studentId, setStudentId] = useState(currentUser?.id || '');
  const [selectedDept, setSelectedDept] = useState(currentUser?.department || DEPARTMENTS[0]);
  const [selectedEqId, setSelectedEqId] = useState('');
  const [borrowQuantity, setBorrowQuantity] = useState<number>(1);
  const [returnTime, setReturnTime] = useState('');
  
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [latestTicket, setLatestTicket] = useState<Booking | null>(null);
  const [isChangingEq, setIsChangingEq] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setStudentName(currentUser.name);
      setStudentId(currentUser.id);
      if (currentUser.department) setSelectedDept(currentUser.department);
    }
  }, [currentUser]);

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

  useEffect(() => {
    const item = equipmentList.find((e) => e.id === selectedEqId);
    if (item) {
      setSelectedItem(item);
      if (borrowQuantity > item.availableStock) {
        setBorrowQuantity(item.availableStock > 0 ? 1 : 0);
      }
    }
  }, [selectedEqId, equipmentList]);

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

    if (!studentName.trim() || !studentId.trim() || studentId.length < 8 || !selectedEqId || !selectedItem) {
      setFormError(t('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง', 'Please fill in all details correctly.'));
      return;
    }
    if (selectedItem.status === 'maintenance' || selectedItem.availableStock <= 0 || borrowQuantity <= 0 || borrowQuantity > selectedItem.availableStock) {
      setFormError(t('อุปกรณ์ไม่พร้อมให้ยืมตามจำนวนที่ระบุ', 'Equipment unavailable for the requested quantity.'));
      return;
    }
    if (!returnTime) {
      setFormError(t('กรุณากำหนดเวลาที่จะนำมาส่งคืน', 'Please specify a return time.'));
      return;
    }

    const now = new Date();
    const borrowTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;
    const returnTimeStr = `${returnTime} น.`;

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

    setBorrowQuantity(1);
    setBookingSuccess(true);
  };

  useEffect(() => {
    if (bookingSuccess && activeBookings.length > 0) {
      const matches = activeBookings.filter((b) => b.studentId === studentId);
      if (matches.length > 0) setLatestTicket(matches[matches.length - 1]);
    }
  }, [bookingSuccess, activeBookings, studentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto relative"
      >
        <button onClick={onBack} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition z-10">
          <X size={18} />
        </button>

        {!bookingSuccess ? (
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-1 mb-2">
              <h2 className="text-2xl font-black text-gray-900">{t('สร้างรายการจอง', 'Create Booking')}</h2>
              <p className="text-xs text-gray-500">{t('กรอกรายละเอียดการยืมอุปกรณ์กีฬา', 'Fill out the details to borrow equipment.')}</p>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{formError}</span>
              </div>
            )}

            {isChangingEq ? (
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-800">{t('เลือกอุปกรณ์ใหม่', 'Select New Equipment')}</h4>
                  <button onClick={() => setIsChangingEq(false)} className="text-xs text-gray-500 hover:text-gray-700 font-bold">{t('ยกเลิก', 'Cancel')}</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
                  {equipmentList.filter(e => e.availableStock > 0 && e.status !== 'maintenance').map(eq => (
                    <button
                      key={eq.id}
                      onClick={() => { setSelectedEqId(eq.id); setIsChangingEq(false); }}
                      className="text-left p-3 rounded-xl border border-gray-200 bg-white hover:border-[#397d54] hover:shadow-sm transition flex gap-3 items-center"
                    >
                      {renderSportIcon(eq.icon, eq.category)}
                      <div>
                        <p className="text-xs font-bold text-gray-900 truncate">{language === 'th' ? eq.thaiName : eq.name}</p>
                        <p className="text-[10px] text-[#397d54] font-bold">{t('ว่าง', 'Available')} {eq.availableStock}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              selectedItem && (
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                  {renderSportIconLarge(selectedItem.icon, selectedItem.category)}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-[#397d54] uppercase tracking-wider">{selectedItem.category}</span>
                        <h3 className="text-base font-black text-gray-900 mt-1 leading-tight">{language === 'th' ? selectedItem.thaiName : selectedItem.name}</h3>
                      </div>
                      <button 
                        onClick={() => setIsChangingEq(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg transition shadow-sm"
                      >
                        <Repeat size={12} />
                        {t('เปลี่ยน', 'Change')}
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs">
                      <div className="bg-white px-2.5 py-1 rounded-md border border-gray-200 font-bold text-gray-700">
                        {t('คลัง:', 'Stock:')} <span className="text-[#397d54]">{selectedItem.availableStock}</span>
                      </div>
                      <div className="text-gray-500 font-medium flex items-center gap-1 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        {selectedItem.location}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">{t('ชื่อ-นามสกุล', 'Full Name')}</label>
                  <input
                    type="text"
                    value={studentName}
                    disabled={!!currentUser}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">{t('รหัสนักศึกษา', 'Student ID')}</label>
                  <input
                    type="text"
                    value={studentId}
                    disabled={!!currentUser}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">{t('จำนวนที่ยืม', 'Quantity')}</label>
                  <div className="flex items-center">
                    <button type="button" onClick={() => setBorrowQuantity(p => Math.max(1, p - 1))} className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-l-xl text-gray-600 font-black">-</button>
                    <input type="number" min="1" max={selectedItem?.availableStock || 1} value={borrowQuantity} onChange={(e) => setBorrowQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-full text-center py-2 bg-gray-50 border-y border-gray-200 text-xs font-bold outline-none" />
                    <button type="button" onClick={() => setBorrowQuantity(p => Math.min(selectedItem?.availableStock || 99, p + 1))} className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-r-xl text-gray-600 font-black">+</button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">{t('เวลาคืน (วันนี้)', 'Return Time')}</label>
                  <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#397d54]" />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full py-3.5 bg-[#397d54] hover:bg-[#2e6242] text-white text-sm font-bold rounded-xl transition flex justify-center items-center gap-2 shadow-sm">
                  <Send size={16} />
                  {t('ยืนยันการจอง', 'Confirm Booking')}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-[#397d54] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">{t('จองสำเร็จ!', 'Booking Successful!')}</h2>
              <p className="text-sm text-gray-500 mt-2">{t('สตาฟฟ์กำลังตรวจสอบคำขอของคุณ', 'Staff is reviewing your request.')}</p>
            </div>
            
            {latestTicket && (
              <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl text-left space-y-3 mx-auto max-w-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs text-gray-500 font-bold">{t('รหัสคิว', 'Ticket')}</span>
                  <span className="text-xs font-black text-gray-900">{latestTicket.ticketCode}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs text-gray-500 font-bold">{t('อุปกรณ์', 'Item')}</span>
                  <span className="text-xs font-bold text-[#397d54]">{latestTicket.equipmentName} x{latestTicket.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 font-bold">{t('เวลาคืน', 'Return By')}</span>
                  <span className="text-xs font-bold text-gray-900">{latestTicket.returnTime}</span>
                </div>
              </div>
            )}

            <button onClick={onBack} className="w-full py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition shadow-sm">
              {t('กลับสู่หน้าแรก', 'Return to Home')}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
