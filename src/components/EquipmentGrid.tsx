import { useState } from 'react';
import { motion } from 'motion/react';
import { Equipment } from '../types';
import { Search, Box } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface EquipmentGridProps {
  equipment: Equipment[];
  onSelectBooking: (item: Equipment) => void;
}

export default function EquipmentGrid({ equipment, onSelectBooking }: EquipmentGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories config
  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'ball', name: 'ลูกบอล' },
    { id: 'racket', name: 'ไม้ตี' },
    { id: 'net', name: 'ตาข่าย' },
    { id: 'field', name: 'ภาคสนาม' },
    { id: 'other', name: 'อื่นๆ' }
  ];

  // Map our categories to the data categories for filtering
  const mapCategory = (catId: string) => {
    switch(catId) {
      case 'ball': return 'ball';
      case 'racket': return 'racket';
      case 'indoor': return 'indoor'; // fallback
      case 'outdoor': return 'outdoor'; // fallback
      default: return 'all';
    }
  }

  // Filter logic
  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.thaiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In a real app we'd map category exactly, but for now just filter loosely or use 'all' if category logic is complex
    const targetCat = mapCategory(selectedCategory);
    const matchesCategory = selectedCategory === 'all' || item.category === targetCat || (selectedCategory === 'other' && !['ball', 'racket'].includes(item.category));

    return matchesSearch && matchesCategory;
  });

  // Render Status Badge helper
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-[#397d54] text-[10px] font-bold rounded-full border border-emerald-100">
            พร้อมใช้งาน
          </span>
        );
      case 'reserved':
      case 'borrowed':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">
            กำลังถูกยืม
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
            ซ่อมบำรุง
          </span>
        );
      default:
        return null;
    }
  };

  // Custom-tailored high quality sport vector SVGs to replace generic or mismatched icons
  const renderSportIcon = (iconName: string, category: string) => {
    let bgColor = "bg-orange-100 text-orange-600";
    let svgContent = null;

    switch (iconName) {
      case 'Dribbble': // Basketball
        bgColor = "bg-amber-100 text-amber-700 animate-pulse-slow";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M6.2 6.2c2.4 2.4 2.4 6.2 0 8.5" />
            <path d="M17.8 6.2c-2.4 2.4-2.4 6.2 0 8.5" />
            <path d="M2 12h20" />
            <path d="M12 2v20" />
          </svg>
        );
        break;

      case 'Activity': // Football/Soccer
        bgColor = "bg-emerald-100 text-[#397d54]";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="12,7.5 15.5,10 14,14 10,14 8.5,10" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 2v5.5M12 14v8M3.8 7.5l4.7 2.5M20.2 7.5l-4.7 2.5M14 14l3.5 3.5M10 14L6.5 17.5" />
          </svg>
        );
        break;

      case 'Sword': // Badminton Racket
        bgColor = "bg-indigo-100 text-indigo-700";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Racket Head */}
            <ellipse cx="8" cy="8" rx="5" ry="5" />
            <path d="M8 3v10M3 8h10" strokeWidth="1" opacity="0.4" />
            {/* Shaft & Handle */}
            <path d="M11.5 11.5l6 6" />
            <path d="M17.5 17.5l3.5 3.5" strokeWidth="3" />
            {/* Shuttlecock */}
            <path d="M15 11 L16 7 L20 7 L21 11 Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M15 11 C16.5 12.5, 19.5 12.5, 21 11" />
          </svg>
        );
        break;

      case 'Tablets': // Ping Pong / Table Tennis
        bgColor = "bg-rose-100 text-rose-600";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Paddle Face */}
            <circle cx="9" cy="9" r="6" fill="currentColor" fillOpacity="0.2" />
            {/* Handle */}
            <path d="M13.2 13.2l4.8 4.8" strokeWidth="3.5" />
            {/* Ball */}
            <circle cx="17" cy="8" r="2.5" fill="currentColor" />
          </svg>
        );
        break;

      case 'Disc': // Volleyball
        bgColor = "bg-sky-100 text-sky-700";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 0 0 20" />
            <path d="M2 12a10 10 0 0 0 20 0" />
            <path d="M6.2 6.2c3 1 3 4 0 5.6" />
            <path d="M17.8 6.2c-3 1-3 4 0 5.6" />
            <path d="M6.2 17.8c3-1 3-4 0-5.6" />
            <path d="M17.8 17.8c-3-1-3-4 0-5.6" />
          </svg>
        );
        break;

      case 'Compass': // Futsal ball
        bgColor = "bg-teal-100 text-teal-700";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20 M2 12h20 M4.9 4.9l14.2 14.2 M4.9 19.1L19.1 4.9" strokeWidth="1.5" opacity="0.5" />
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.15" />
          </svg>
        );
        break;

      case 'Target': // Petanque Set
        bgColor = "bg-slate-100 text-slate-600";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Boules */}
            <circle cx="8" cy="14" r="6" fill="currentColor" fillOpacity="0.15" />
            <path d="M4.5 11c1.5 1.5 3.5 1.5 5 0M4 14c2 2 4 2 6 0" strokeWidth="1" opacity="0.8" />
            
            <circle cx="17" cy="10" r="5" fill="currentColor" fillOpacity="0.05" />
            <path d="M13.5 8c1.5 1.5 3 1.5 4.5 0" strokeWidth="1" opacity="0.8" />

            {/* Target Jack Ball */}
            <circle cx="15" cy="17" r="2.2" fill="currentColor" />
          </svg>
        );
        break;

      case 'Grid': // Chess Board / Indoor board games
        bgColor = "bg-[#fcf8f2] text-amber-900 border border-amber-100";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            <rect x="3" y="3" width="6" height="6" fill="currentColor" fillOpacity="0.3" />
            <rect x="15" y="3" width="6" height="6" fill="currentColor" fillOpacity="0.3" />
            <rect x="9" y="9" width="6" height="6" fill="currentColor" fillOpacity="0.3" />
            <rect x="3" y="15" width="6" height="6" fill="currentColor" fillOpacity="0.3" />
            <rect x="15" y="15" width="6" height="6" fill="currentColor" fillOpacity="0.3" />
          </svg>
        );
        break;

      case 'LifeBuoy': // Handball
        bgColor = "bg-orange-100 text-orange-700";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2c3.5 4 3.5 8 0 10" />
            <path d="M12 12c-3.5 4-3.5 8 0 10" />
            <path d="M2 12c4 3.5 8 3.5 10 0" />
            <path d="M12 12c4-3.5 8-3.5 10 0" />
          </svg>
        );
        break;

      case 'Takraw': // Sepak Takraw
        bgColor = "bg-amber-100 text-amber-800";
        svgContent = (
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2c3.5 4 3.5 16 0 20" />
            <path d="M12 2c-3.5 4-3.5 16 0 20" />
            <path d="M2 12c4 3.5 16 3.5 20 0" />
            <path d="M2 12c4-3.5 16-3.5 20 0" />
            <path d="M4.9 4.9c5 2 12 9 14.2 14.2" strokeWidth="1.5" />
            <path d="M19.1 4.9c-5 2-12 9-14.2 14.2" strokeWidth="1.5" />
          </svg>
        );
        break;

      default:
        // Fallback to standard Lucide Box if anything else is defined
        const IconComponent = (LucideIcons as any)[iconName] || Box;
        if (category === 'racket') bgColor = "bg-purple-100 text-purple-600";
        else if (category === 'indoor') bgColor = "bg-blue-100 text-blue-600";
        else if (category === 'outdoor') bgColor = "bg-gray-100 text-gray-600";
        svgContent = <IconComponent size={20} />;
        break;
    }

    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 ${bgColor}`}>
        {svgContent}
      </div>
    );
  };

  return (
    <div className="space-y-8" id="equipment-grid-container">
      {/* Top Bar: Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2" id="categories-pill-wrapper">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#397d54] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              id={`cat-pill-${cat.id}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-64" id="search-bar-wrapper">
          <input
            type="text"
            placeholder="ค้นหาอุปกรณ์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-full text-xs focus:outline-none focus:border-[#397d54] focus:ring-2 focus:ring-[#397d54]/10 shadow-sm transition-all"
            id="search-input"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" id="equipment-cards-grid">
          {filteredEquipment.map((item, idx) => {
            const isOut = item.availableStock === 0;
            const isMaintenance = item.status === 'maintenance';
            const isAvailable = item.status === 'available' && !isOut;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05, ease: 'easeOut' }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                id={`eq-card-${item.id}`}
              >
                {/* Top Half: Icon & Status */}
                <div className="bg-gray-50/80 px-5 py-4 flex justify-between items-start border-b border-gray-100/50">
                  {renderSportIcon(item.icon, item.category)}
                  {renderStatusBadge(item.status)}
                </div>

                {/* Bottom Half: Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4 flex-1">
                    <h3 className="font-extrabold text-gray-900 text-[15px] leading-tight mb-1" id={`card-title-th-${item.id}`}>
                      {item.thaiName}
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {item.location}
                    </p>
                  </div>

                  {/* Stock Progress */}
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between items-end text-xs">
                      <span className="text-gray-500 font-medium">คงเหลือ</span>
                      <span className="font-bold text-gray-900">
                        {item.availableStock}/{item.totalStock}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${isAvailable ? 'bg-[#397d54]' : 'bg-gray-400'}`}
                        style={{ width: `${(item.availableStock / item.totalStock) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isAvailable ? (
                      <button
                        onClick={() => onSelectBooking(item)}
                        className="w-full py-2.5 bg-[#397d54] text-white text-[11px] font-bold rounded-xl hover:bg-[#2c5f3f] active:scale-[0.98] transition-colors shadow-sm"
                        id={`btn-book-${item.id}`}
                      >
                        จองออนไลน์
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 bg-gray-200 text-gray-500 text-[11px] font-bold rounded-xl cursor-not-allowed"
                        id={`btn-out-${item.id}`}
                      >
                        ปิดรับจอง
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl" id="empty-results-box">
          <Box size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="font-extrabold text-gray-800 text-base">ไม่พบข้อมูลอุปกรณ์กีฬา</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือกรองตามหมวดหมู่อื่น
          </p>
        </div>
      )}
    </div>
  );
}