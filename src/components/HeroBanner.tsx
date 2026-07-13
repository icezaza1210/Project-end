import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';
import { Megaphone, ChevronRight, ChevronLeft } from 'lucide-react';

const announcements = [
  {
    id: 1,
    badge: 'ประกาศกิจกรรม',
    badgeEn: 'Activity Announcement',
    title: 'รับสมัครนักกีฬาคณะวิทยาศาสตร์ ประจำปี 2026',
    titleEn: 'Science Faculty Athletes Recruitment 2026',
    desc: 'สโมสรนักศึกษาเปิดรับสมัครนักศึกษาที่มีความสามารถด้านกีฬา เพื่อเป็นตัวแทนคณะฯ เข้าร่วมการแข่งขันกีฬามหาวิทยาลัย',
    descEn: 'The student club is recruiting talented athletes to represent the faculty in the university sports games.',
    image: 'https://images.unsplash.com/photo-1518605368461-1e1c25222ba3?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-[#397d54]'
  },
  {
    id: 2,
    badge: 'ข่าวสารสโมฯ',
    badgeEn: 'Club News',
    title: 'อัปเดตอุปกรณ์กีฬาใหม่เอี่ยม!',
    titleEn: 'Brand New Sports Equipment Update!',
    desc: 'ทางสโมสรได้จัดซื้อลูกบาสเกตบอลและไม้แบดมินตันชุดใหม่ พร้อมให้บริการยืมแล้ววันนี้ที่ห้องสโมสร',
    descEn: 'The club has purchased new basketballs and badminton rackets, available for borrowing today.',
    image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-indigo-700'
  },
  {
    id: 3,
    badge: 'โปรดทราบ',
    badgeEn: 'Notice',
    title: 'งดให้บริการยืมอุปกรณ์ชั่วคราวสัปดาห์หน้า',
    titleEn: 'Temporary Suspension of Borrowing Services Next Week',
    desc: 'เนื่องจากมีการปรับปรุงห้องสโมสรนักศึกษา จะงดให้บริการยืม-คืนอุปกรณ์กีฬาในวันที่ 15-20 กรกฎาคม นี้',
    descEn: 'Due to student club room renovation, borrowing services will be suspended from July 15-20.',
    image: 'https://images.unsplash.com/photo-1504305754058-2f08ccd89a0a?q=80&w=1000&auto=format&fit=crop',
    color: 'bg-rose-700'
  }
];

export default function HeroBanner() {
  const { t, language } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % announcements.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);

  const current = announcements[currentIndex];

  return (
    <div className={`w-full rounded-3xl overflow-hidden shadow-sm relative flex flex-col md:flex-row mb-8 transition-colors duration-1000 ${current.color}`}>
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none z-0"></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col md:flex-row z-10"
        >
          {/* Content */}
          <div className="p-8 md:p-10 lg:p-12 md:w-[60%] lg:w-[65%] flex flex-col justify-center h-full">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 w-fit mb-5 backdrop-blur-sm">
              <Megaphone size={12} className="text-white" />
              <span className="text-[10px] sm:text-xs font-bold text-white tracking-wide uppercase">
                {language === 'th' ? current.badge : current.badgeEn}
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-[1.3] tracking-tight mb-4 text-balance">
              {language === 'th' ? current.title : current.titleEn}
            </h2>
            
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-[90%] font-medium">
              {language === 'th' ? current.desc : current.descEn}
            </p>
          </div>
          
          {/* Image */}
          <div className="hidden md:block md:w-[50%] lg:w-[45%] relative h-full overflow-hidden ml-auto">
            <img 
              src={current.image} 
              alt={current.title} 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity"
            />
            {/* Gradient fade to blend with background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${
              current.id === 1 ? 'from-[#397d54]' : 
              current.id === 2 ? 'from-indigo-700' : 
              'from-rose-700'
            } via-transparent to-transparent z-10`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 left-8 md:left-10 lg:left-12 z-20 flex items-center gap-3">
        {announcements.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
      
      <div className="absolute bottom-5 right-6 md:right-8 z-20 flex items-center gap-2">
        <button onClick={prevSlide} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition">
          <ChevronLeft size={16} />
        </button>
        <button onClick={nextSlide} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Maintain Height */}
      <div className="invisible p-8 md:p-10 lg:p-12 md:w-[60%] lg:w-[65%] flex flex-col justify-center min-h-[280px]">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5">
           <span className="text-xs">Placeholder</span>
        </div>
        <h2 className="text-3xl lg:text-4xl mb-4">Placeholder Title That Might Be Two Lines Long</h2>
        <p className="text-sm">Placeholder description to keep the height consistent across slides.</p>
      </div>
    </div>
  );
}
