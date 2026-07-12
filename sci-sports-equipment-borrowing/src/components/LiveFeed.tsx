import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityLog, Equipment, Booking } from '../types';
import { Radio, Bell, ArrowUpRight, ShieldAlert, CheckCircle, RefreshCcw } from 'lucide-react';

interface LiveFeedProps {
  logs: ActivityLog[];
  equipment: Equipment[];
  bookings: Booking[];
}

export default function LiveFeed({ logs, equipment, bookings }: LiveFeedProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live timer tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute live key stats
  const totalEquipmentCount = equipment.reduce((sum, item) => sum + item.totalStock, 0);
  const totalAvailableCount = equipment.reduce((sum, item) => sum + item.availableStock, 0);
  
  // Real active bookings in the field
  const activeBorrows = bookings.filter((b) => b.status === 'active').length;
  // Bookings currently pending staff review
  const pendingApprovals = bookings.filter((b) => b.status === 'pending').length;
  
  // Calculate general utilization rate
  const utilizationPercentage = totalEquipmentCount > 0 
    ? Math.round(((totalEquipmentCount - totalAvailableCount) / totalEquipmentCount) * 100) 
    : 0;

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'borrow':
        return <ArrowUpRight className="text-amber-500" size={14} />;
      case 'booking':
        return <Bell className="text-[#397d54]" size={14} />;
      case 'return':
        return <CheckCircle className="text-[#397d54]" size={14} />;
      case 'maintenance':
        return <ShieldAlert className="text-rose-500" size={14} />;
      default:
        return <Radio className="text-gray-400" size={14} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="live-feed-dashboard-row">
      {/* KPI Box 1: Student Union Live Stat (Green Highlight) */}
      <div className="md:col-span-1 bg-[#397d54] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[170px] relative overflow-hidden" id="kpi-sport-stats">
        {/* Wave background decor */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-4 translate-y-4">
          <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" />
          </svg>
        </div>

        <div className="flex justify-between items-start" id="kpi-union-header">
          <div>
            <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">FACULTY OF SCIENCE</p>
            <h3 className="font-extrabold text-sm text-white mt-0.5">สถานะห้องสโมสรนักศึกษา</h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-xs font-bold rounded-full border border-white/10" id="live-time-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-emerald-300">{currentTime || '--:--:--'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-600" id="kpi-metrics-grid">
          <div>
            <p className="text-[10px] text-emerald-200 font-bold uppercase">กำลังยืมเล่นกีฬา</p>
            <p className="text-2xl font-black mt-1 text-[#e0ac04]">{activeBorrows} <span className="text-xs font-normal text-emerald-100">รายการ</span></p>
          </div>
          <div>
            <p className="text-[10px] text-emerald-200 font-bold uppercase">รอสโมฯ อนุมัติ</p>
            <p className="text-2xl font-black mt-1 text-white">{pendingApprovals} <span className="text-xs font-normal text-emerald-100">คิว</span></p>
          </div>
        </div>
      </div>

      {/* KPI Box 2: Inventory Utilization details (Light theme) */}
      <div className="bg-white border border-[#e3e3e4] p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[170px]" id="kpi-utilization">
        <div id="kpi-util-header">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Inventory Metrics</p>
          <h3 className="font-extrabold text-sm text-gray-800 mt-0.5">อัตราการใช้งานอุปกรณ์กีฬา</h3>
        </div>

        <div className="space-y-3" id="kpi-util-content">
          <div className="flex justify-between items-end" id="util-label-row">
            <span className="text-xs text-gray-500 font-bold">ถูกยืมกระจายตัวอยู่กลางแจ้ง</span>
            <span className="text-sm font-extrabold text-[#397d54]">{utilizationPercentage}%</span>
          </div>
          
          {/* Custom progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2" id="util-progress-container">
            <div
              className="bg-[#397d54] h-2 rounded-full transition-all duration-500"
              style={{ width: `${utilizationPercentage}%` }}
              id="util-progress-bar"
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-gray-400 font-semibold" id="util-counts">
            <span>สต็อกว่างในสโมฯ: {totalAvailableCount} ชิ้น</span>
            <span>ทั้งหมดที่มี: {totalEquipmentCount} ชิ้น</span>
          </div>
        </div>
      </div>

      {/* KPI Box 3: Scrolling Live logs (Sport Activity Log) */}
      <div className="bg-white border border-[#e3e3e4] p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[170px]" id="kpi-scrolling-logs">
        <div className="flex justify-between items-center mb-3" id="kpi-logs-header">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Real-time Stream</p>
            <h3 className="font-extrabold text-sm text-gray-800 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e0ac04] inline-block animate-pulse"></span>
              ประวัติความเคลื่อนไหวล่าสุด
            </h3>
          </div>
          <RefreshCcw size={12} className="text-gray-400 cursor-pointer hover:rotate-180 transition duration-300" title="Auto-updating in real-time" />
        </div>

        {/* List scroll */}
        <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1" id="kpi-logs-list">
          <AnimatePresence initial={false}>
            {logs.slice().reverse().map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 p-1.5 hover:bg-gray-50 rounded-lg transition"
                id={`log-item-${log.id}`}
              >
                <div className="mt-0.5 flex-shrink-0" id={`log-icon-wrap-${log.id}`}>
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0" id={`log-text-wrap-${log.id}`}>
                  <p className="text-[11px] text-gray-700 font-medium truncate leading-tight">
                    {log.message}
                  </p>
                  <span className="text-[9px] text-gray-400 font-mono block">
                    เมื่อ {log.timestamp}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
