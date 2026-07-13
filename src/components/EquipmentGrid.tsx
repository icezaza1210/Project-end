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

  // Simplified icon rendering (we can use emoji or lucide)
  const renderSportIcon = (iconName: string, category: string) => {
    const IconComponent = (LucideIcons as any)[iconName] || Box;
    
    // Try to map some categories to colored circular backgrounds for the image look
    let bgColor = "bg-orange-100 text-orange-600";
    if (category === 'racket') bgColor = "bg-purple-100 text-purple-600";
    else if (category === 'indoor') bgColor = "bg-blue-100 text-blue-600";
    else if (category === 'outdoor') bgColor = "bg-gray-100 text-gray-600";
    
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgColor}`}>
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
            placeholder="ค้นหาอุปกรณ์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-transparent border border-gray-300 rounded-full text-xs focus:outline-none focus:border-[#397d54] transition-colors"
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
