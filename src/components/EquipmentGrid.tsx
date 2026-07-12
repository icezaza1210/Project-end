import { useState } from 'react';
import { motion } from 'motion/react';
import { Equipment, EquipmentCategory } from '../types';
import { Search, Filter, Box, MapPin, CheckCircle2, AlertCircle, Clock, Ban } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface EquipmentGridProps {
  equipment: Equipment[];
  onSelectBooking: (item: Equipment) => void;
}

export default function EquipmentGrid({ equipment, onSelectBooking }: EquipmentGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Categories config
  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'ball', name: 'ประเภทลูกบอล' },
    { id: 'racket', name: 'ประเภทไม้ตี' },
    { id: 'indoor', name: 'ในร่ม / บอร์ดเกม' },
    { id: 'outdoor', name: 'กีฬากลางแจ้ง' }
  ];

  // Dynamically resolve icon
  const renderSportIcon = (iconName: string) => {
    // Resolve icon from lucide-react dynamically
    const IconComponent = (LucideIcons as any)[iconName] || Box;
    return <IconComponent className="text-[#397d54]" size={28} />;
  };

  // Filter logic
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.thaiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Render Status Badge helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-[#397d54] text-xs font-bold rounded-md border border-emerald-200">
            <CheckCircle2 size={12} />
            ว่างพร้อมยืม
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-[#e0ac04] text-xs font-bold rounded-md border border-amber-200">
            <Clock size={12} />
            ถูกจองแล้ว
          </span>
        );
      case 'borrowed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-md border border-gray-200">
            <AlertCircle size={12} />
            กำลังถูกยืม
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-200">
            <Ban size={12} />
            ส่งซ่อมบำรุง
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6" id="equipment-grid-container">
      {/* Search and Filters Strip */}
      <div className="bg-white border border-[#e3e3e4] rounded-2xl p-5 shadow-sm space-y-4" id="inventory-filter-box">
        <div className="flex flex-col md:flex-row gap-3" id="search-filter-layout">
          {/* Search bar */}
          <div className="relative flex-1" id="search-bar-wrapper">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาอุปกรณ์กีฬา, ชื่อภาษาอังกฤษ, ตู้เก็บอุปกรณ์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e3e3e4] rounded-xl text-sm focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition"
              id="search-input"
            />
          </div>

          {/* Quick status filter select */}
          <div className="flex items-center gap-2" id="status-filter-wrapper">
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap flex items-center gap-1">
              <Filter size={14} /> สถานะ:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-[#e3e3e4] rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54]"
              id="status-select"
            >
              <option value="all">ทั้งหมด</option>
              <option value="available">เฉพาะที่ว่างพร้อมยืม</option>
              <option value="reserved">ที่โดนจองไว้</option>
              <option value="borrowed">ที่กำลังยืมอยู่</option>
              <option value="maintenance">ที่ส่งซ่อมบำรุง</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3" id="categories-pill-wrapper">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-[#397d54] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              id={`cat-pill-${cat.id}`}
            >
              {cat.id === 'all' && <Box size={13} />}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Count Label */}
      <div className="flex justify-between items-center px-1" id="results-meta">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          อุปกรณ์ที่ตรงตามเงื่อนไข ({filteredEquipment.length} ชิ้น)
        </span>
        <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#397d54]"></span> ว่างพร้อมยืม
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#e0ac04]"></span> ถูกจอง
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> ส่งซ่อม
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" id="equipment-cards-grid">
          {filteredEquipment.map((item, idx) => {
            const isOut = item.availableStock === 0;
            const isMaintenance = item.status === 'maintenance';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="bg-white border border-[#e3e3e4] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-400 transition flex flex-col justify-between"
                id={`eq-card-${item.id}`}
              >
                <div>
                  {/* Card Header Info */}
                  <div className="flex justify-between items-start mb-4" id={`card-header-${item.id}`}>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100" id={`icon-bg-${item.id}`}>
                      {renderSportIcon(item.icon)}
                    </div>
                    {renderStatusBadge(item.status)}
                  </div>

                  {/* Name and Description */}
                  <div className="space-y-1.5" id={`card-desc-${item.id}`}>
                    <h3 className="font-extrabold text-gray-900 text-base" id={`card-title-en-${item.id}`}>
                      {item.name}
                    </h3>
                    <h4 className="font-semibold text-gray-700 text-xs" id={`card-title-th-${item.id}`}>
                      {item.thaiName}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed" id={`card-text-desc-${item.id}`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Stock Metrics and Location */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs" id={`card-metrics-${item.id}`}>
                    <div className="flex justify-between items-center" id={`stock-row-${item.id}`}>
                      <span className="text-gray-500 font-medium">อุปกรณ์พร้อมใช้งานตอนนี้:</span>
                      <span className="font-extrabold text-sm text-gray-900">
                        {item.availableStock} <span className="text-[10px] text-gray-400">/ {item.totalStock} ชิ้น</span>
                      </span>
                    </div>

                    {/* Progress indicator */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5" id={`progress-bg-${item.id}`}>
                      <div
                        className="bg-[#397d54] h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(item.availableStock / item.totalStock) * 100}%` }}
                        id={`progress-fill-${item.id}`}
                      ></div>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-500 font-semibold pt-1" id={`location-row-${item.id}`}>
                      <MapPin size={13} className="text-gray-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-5" id={`card-action-${item.id}`}>
                  {isMaintenance ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-1"
                      id={`btn-maint-${item.id}`}
                    >
                      งดให้บริการชั่วคราว
                    </button>
                  ) : isOut ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-gray-100 text-gray-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-1"
                      id={`btn-out-${item.id}`}
                    >
                      อุปกรณ์หมดคลังชั่วคราว
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectBooking(item)}
                      className="w-full py-2.5 bg-[#397d54] text-white text-xs font-bold rounded-xl hover:bg-[#2c5f3f] active:scale-[0.98] transition flex items-center justify-center gap-1"
                      id={`btn-book-${item.id}`}
                    >
                      จองออนไลน์
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-[#e3e3e4] rounded-2xl" id="empty-results-box">
          <Box size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="font-extrabold text-gray-800 text-lg">ไม่พบข้อมูลอุปกรณ์กีฬา</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือกรองตามสถานะอื่นที่ใกล้เคียง เช่น เลือกแสดงข้อมูลทั้งหมด
          </p>
        </div>
      )}
    </div>
  );
}
