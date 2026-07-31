import { useState } from 'react';
import { motion } from 'motion/react';
import { Equipment } from '../types';
import { Search, Box } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { getEquipmentImage } from '../lib/equipmentImages';

interface EquipmentGridProps {
  equipment: Equipment[];
  onSelectBooking: (item: Equipment) => void;
}

export default function EquipmentGrid({ equipment, onSelectBooking }: EquipmentGridProps) {
  const { t, language } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categories config
  const categories = [
    { id: 'all', name: t('ทั้งหมด', 'All') },
    { id: 'ball', name: t('ลูกบอล', 'Balls') },
    { id: 'racket', name: t('ไม้ตี', 'Rackets') },
    { id: 'other', name: t('อื่นๆ', 'Others') }
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
            {t('พร้อมใช้งาน', 'Available')}
          </span>
        );
      case 'reserved':
      case 'borrowed':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-100">
            {t('กำลังถูกยืม', 'Borrowed')}
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
            {t('ซ่อมบำรุง', 'Maintenance')}
          </span>
        );
      default:
        return null;
    }
  };

  // Dedicated sport icon rendering matching each equipment item accurately
  const renderSportIcon = (item: Equipment) => {
    const text = `${item.name || ''} ${item.thaiName || ''} ${item.icon || ''} ${item.id || ''}`.toLowerCase();

    // 1. ลูกฟุตบอล (Football)
    if (text.includes('ฟุตบอล') || text.includes('football') || text.includes('soccer')) {
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-emerald-700 shadow-md border border-emerald-200/80 backdrop-blur-sm" title="ลูกฟุตบอล">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 15 8.5 14 12 10 12 9 8.5 12 6" fill="currentColor" fillOpacity="0.25" />
            <line x1="12" y1="2" x2="12" y2="6" />
            <line x1="21.5" y1="8.5" x2="15" y2="8.5" />
            <line x1="18" y1="19" x2="14" y2="12" />
            <line x1="6" y1="19" x2="10" y2="12" />
            <line x1="2.5" y1="8.5" x2="9" y2="8.5" />
          </svg>
        </div>
      );
    }

    // 2. ไม้แบดมินตัน (Badminton Racket)
    if (text.includes('แบดมินตัน') || text.includes('badminton') || text.includes('racket')) {
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-indigo-700 shadow-md border border-indigo-200/80 backdrop-blur-sm" title="ไม้แบดมินตัน">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="15" cy="9" rx="5" ry="6" transform="rotate(-30 15 9)" fill="currentColor" fillOpacity="0.15" />
            <path d="M12 7l6 4M13.5 5.5l3 5M16.5 12.5l-3-5" opacity="0.6" strokeWidth="1.2" />
            <line x1="11" y1="13.5" x2="4" y2="20.5" strokeWidth="2.5" />
            <path d="M6 6l3 3M5 9l2 2M8 4l2 2" />
            <circle cx="4.5" cy="4.5" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );
    }

    // 3. ลูกวอลเลย์บอล (Volleyball)
    if (text.includes('วอลเลย์บอล') || text.includes('volleyball')) {
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-sky-700 shadow-md border border-sky-200/80 backdrop-blur-sm" title="ลูกวอลเลย์บอล">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
            <path d="M12 2a10 10 0 0 0-8.66 15" />
            <path d="M12 22a10 10 0 0 0 8.66-15" />
            <path d="M3.34 7a10 10 0 0 0 17.32 10" />
            <path d="M12 12c-3.5 0-6.5-1.5-8.5-4" />
            <path d="M12 12c1.75 3 4.75 4.5 8.25 4" />
            <path d="M12 12c1.75-3 1.75-6.5.25-9.5" />
          </svg>
        </div>
      );
    }

    // 4. ลูกฟุตซอล (Futsal Ball)
    if (text.includes('ฟุตซอล') || text.includes('futsal')) {
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-teal-700 shadow-md border border-teal-200/80 backdrop-blur-sm" title="ลูกฟุตซอล">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
            <polygon points="12 7 15.5 9.5 14 13.5 10 13.5 8.5 9.5" fill="currentColor" fillOpacity="0.3" />
            <path d="M12 2v5M21.5 8.5H15.5M18.5 18.5L14 13.5M5.5 18.5L10 13.5M2.5 8.5h6" />
          </svg>
        </div>
      );
    }

    // 5. ลูกตะกร้อ (Sepak Takraw)
    if (text.includes('ตะกร้อ') || text.includes('takraw')) {
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-amber-700 shadow-md border border-amber-200/80 backdrop-blur-sm" title="ลูกตะกร้อ">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.12" />
            <circle cx="12" cy="12" r="4.5" strokeWidth="1.4" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 2c2.2 3 2.2 7 0 10" />
            <path d="M12 22c-2.2-3-2.2-7 0-10" />
            <path d="M2 12c3-2.2 7-2.2 10 0" />
            <path d="M22 12c-3 2.2-7 2.2-10 0" />
          </svg>
        </div>
      );
    }

    // 6. ลูกเปตอง (Petanque)
    if (text.includes('เปตอง') || text.includes('petanque')) {
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-slate-700 shadow-md border border-slate-300/80 backdrop-blur-sm" title="ลูกเปตอง">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="13" r="7" fill="currentColor" fillOpacity="0.15" />
            <path d="M6.5 9.5a7 7 0 0 1 7 0" />
            <path d="M6 13a7 7 0 0 1 8 0" />
            <circle cx="17.5" cy="7.5" r="4.5" fill="currentColor" fillOpacity="0.1" />
            <path d="M14.8 6.5a4.5 4.5 0 0 1 5 0" />
            <circle cx="5.5" cy="5.5" r="1.8" fill="currentColor" />
          </svg>
        </div>
      );
    }

    // 7. บาสเกตบอล (Basketball)
    if (text.includes('บาสเกตบอล') || text.includes('basketball')) {
      return (
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-orange-700 shadow-md border border-orange-200/80 backdrop-blur-sm" title="บาสเกตบอล">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.15" />
            <path d="M2 12h20" />
            <path d="M12 2v20" />
            <path d="M4.93 4.93a10 10 0 0 1 14.14 0" />
            <path d="M4.93 19.07a10 10 0 0 0 14.14 0" />
          </svg>
        </div>
      );
    }

    // Default fallback Lucide icon
    const IconComponent = (LucideIcons as any)[item.icon] || Box;
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/95 text-emerald-700 shadow-md border border-emerald-200/80 backdrop-blur-sm">
        <IconComponent size={20} />
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
            placeholder={t('ค้นหาอุปกรณ์...', 'Search equipment...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 shadow-sm rounded-full text-xs focus:outline-none focus:border-[#397d54] transition-colors"
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
                {/* Top Half: Image & Status */}
                <div className="relative h-44 bg-gray-100 overflow-hidden border-b border-gray-100/50 group">
                  <img 
                    src={getEquipmentImage(item)} 
                    alt={item.thaiName} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>
                  <div className="absolute top-3 right-3 z-10 shadow-sm">
                    {renderStatusBadge(item.status)}
                  </div>
                  <div className="absolute top-3 left-3 z-10">
                    {renderSportIcon(item)}
                  </div>
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
                      <span className="text-gray-500 font-medium">{t('คงเหลือ', 'Remaining')}</span>
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
                        {t('จองออนไลน์', 'Book Online')}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 bg-gray-200 text-gray-500 text-[11px] font-bold rounded-xl cursor-not-allowed"
                        id={`btn-out-${item.id}`}
                      >
                        {t('ปิดรับจอง', 'Unavailable')}
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
          <h3 className="font-extrabold text-gray-800 text-base">{t('ไม่พบข้อมูลอุปกรณ์กีฬา', 'No equipment found')}</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {t('ลองปรับเปลี่ยนคำค้นหา หรือกรองตามหมวดหมู่อื่น', 'Try adjusting your search or filtering by another category')}
          </p>
        </div>
      )}
    </div>
  );
}
