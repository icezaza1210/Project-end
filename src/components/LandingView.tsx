import React from 'react';
import { Trophy, ArrowRight, Activity, Calendar, Users, ShoppingBag, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingViewProps {
  onNavigateToLogin: () => void;
}

export default function LandingView({ onNavigateToLogin }: LandingViewProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans" id="landing-container">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#397d54] to-[#245236] rounded-xl flex items-center justify-center shadow-sm">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 leading-tight">SCI-SPORTS</h1>
              <p className="text-[10px] font-bold text-emerald-700 tracking-widest uppercase">Borrow System</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#" className="text-[#397d54] border-b-2 border-[#397d54] pb-1">หน้าแรก</a>
            <a href="#about" className="hover:text-[#397d54] transition-colors pb-1">เกี่ยวกับระบบ</a>
            <a href="#contact" className="hover:text-[#397d54] transition-colors pb-1">ติดต่อเรา</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onNavigateToLogin}
              className="px-5 py-2.5 bg-[#397d54] hover:bg-[#2c5f3f] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-900/10 flex items-center gap-2 group"
            >
              เข้าสู่ระบบ / ลงทะเบียน
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="bg-[#397d54] rounded-3xl overflow-hidden relative shadow-xl shadow-emerald-900/10 min-h-[400px] flex items-center">
            {/* Decorative background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent"></div>
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>
            
            <div className="relative z-10 px-8 md:px-16 py-12 md:w-1/2 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold tracking-wider mb-6 border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#e0ac04] animate-pulse"></span>
                  เปิดให้บริการภาคเรียน 1/2026
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  ยืม-คืนอุปกรณ์กีฬา <br /> สะดวก รวดเร็ว
                </h2>
                <p className="text-emerald-50 mb-8 max-w-md text-sm md:text-base leading-relaxed opacity-90">
                  ระบบบริการยืม-คืนอุปกรณ์กีฬาสำหรับนักศึกษาคณะวิทยาศาสตร์ มหาวิทยาลัยราชภัฏพระนคร ตรวจสอบสถานะอุปกรณ์ได้แบบเรียลไทม์ และจองคิวออนไลน์ได้ทันที
                </p>
                <button 
                  onClick={onNavigateToLogin}
                  className="px-8 py-3.5 bg-white text-[#397d54] hover:bg-gray-50 text-sm font-bold rounded-xl transition-all flex items-center gap-2 group shadow-lg"
                >
                  เริ่มใช้งานระบบ
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>

            {/* Placeholder for Hero Image/Graphic */}
            <div className="hidden md:block absolute right-0 bottom-0 w-1/2 h-full">
               <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#397d54]"></div>
               <img 
                 src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1000&auto=format&fit=crop" 
                 alt="Sports Equipment" 
                 className="w-full h-full object-cover opacity-60 mix-blend-overlay"
               />
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20" id="about">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">บริการของเรา</h3>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
              อำนวยความสะดวกให้นักศึกษาด้วยระบบจัดการที่ทันสมัย ลดขั้นตอนการทำงาน และเพิ่มประสิทธิภาพในการให้บริการ
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity size={24} className="text-[#397d54]" />,
                title: 'Real-time Tracking',
                desc: 'ตรวจสอบจำนวนอุปกรณ์กีฬาที่ว่างพร้อมยืมได้ทันทีผ่านระบบออนไลน์ ไม่ต้องเสียเวลามาเช็คด้วยตัวเอง'
              },
              {
                icon: <Calendar size={24} className="text-[#397d54]" />,
                title: 'Online Booking',
                desc: 'จองคิวยืมอุปกรณ์ล่วงหน้าผ่านระบบ เพื่อความแน่นอนในการนำอุปกรณ์ไปใช้งานตามเวลาที่ต้องการ'
              },
              {
                icon: <Users size={24} className="text-[#397d54]" />,
                title: 'Staff Management',
                desc: 'ระบบจัดการสำหรับสตาฟฟ์สโมสรฯ เพื่อติดตามสถานะการยืม-คืนได้อย่างมีประสิทธิภาพและลดข้อผิดพลาด'
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer (matching the requested design style) */}
      <footer className="bg-[#397d54] text-white pt-16 pb-8" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Col */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white mb-1">SCI-SPORTS</h2>
                <p className="text-xs font-medium text-emerald-200 uppercase tracking-widest">Borrow System</p>
              </div>
              <p className="text-sm text-emerald-100/80 font-light leading-relaxed">
                สโมสรนักศึกษา คณะวิทยาศาสตร์<br/>มหาวิทยาลัยราชภัฏพระนคร
              </p>
            </div>
            
            {/* Support Col */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold">ติดต่อสโมสรฯ</h3>
              <ul className="space-y-4 text-sm text-emerald-100/80 font-light">
                <li>อาคารคณะวิทยาศาสตร์ ชั้น 1<br/>ห้องสโมสรนักศึกษา</li>
                <li>02-544-8456</li>
              </ul>
            </div>
            
            {/* Links Col */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold">เมนูลัด</h3>
              <ul className="space-y-4 text-sm text-emerald-100/80 font-light">
                <li>
                  <button onClick={onNavigateToLogin} className="hover:text-white transition-colors text-left">
                    เข้าสู่ระบบ
                  </button>
                </li>
              </ul>
            </div>

            {/* Faculty Link Col */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold">เว็บไซต์คณะ</h3>
              <p className="text-sm text-emerald-100/80 font-light">
                ติดตามข่าวสารและข้อมูลเพิ่มเติมของคณะวิทยาศาสตร์
              </p>
              <div>
                <a 
                  href="https://sci.pnru.ac.th" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700/60 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold border border-emerald-500/30 transition-all hover:shadow-md"
                >
                  <span>เว็บไซต์คณะวิทยาศาสตร์</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-emerald-700/50 pt-8 flex flex-col md:flex-row items-center justify-center text-xs text-emerald-200/60 font-light">
            <p>สโมสรนักศึกษา คณะวิทยาศาสตร์ มหาวิทยาลัยราชภัฏพระนคร © {new Date().getFullYear()}. All right reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
