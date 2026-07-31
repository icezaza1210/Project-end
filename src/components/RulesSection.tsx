import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, FileText, AlertTriangle, ShieldCheck, Clock, BookOpen, Ban } from 'lucide-react';

export default function RulesSection() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const sections = [
    {
      title: '1. คุณสมบัติของผู้มีสิทธิ์ยืมอุปกรณ์',
      icon: <ShieldCheck size={18} />,
      content: (
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 font-medium">
          <li>เป็นนักศึกษาระดับปริญญาตรี คณะวิทยาศาสตร์ มหาวิทยาลัยราชภัฏพระนคร ที่มีสถานภาพนักศึกษาปัจจุบัน</li>
          <li>ต้องลงทะเบียนและยืนยันตัวตนผ่านระบบ SCI-SPORTS BORROW SYSTEM ก่อนการใช้งานทุกครั้ง</li>
        </ul>
      )
    },
    {
      title: '2. ขั้นตอนและระยะเวลาในการยืม-คืน',
      icon: <Clock size={18} />,
      content: (
        <div className="space-y-4 text-sm text-gray-700 font-medium">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-1">การจองและยืมผ่านระบบ</h4>
            <p>ผู้ยืมต้องทำรายการจองผ่านระบบล่วงหน้าอย่างน้อย 30 นาที (หรือยืมแบบ Walk-in กรณีอุปกรณ์ว่าง) และต้องมารับอุปกรณ์ด้วยตนเอง ณ ห้องสโมสรนักศึกษา พร้อมแสดงรหัสนักศึกษา/บัตรนักศึกษา หรือหน้าจอสถานะการจอง</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <h4 className="font-bold text-gray-900 mb-1">ระยะเวลาการยืม</h4>
             <p>ยืมได้สูงสุดไม่เกิน 3 วันทำการ ต่อ 1 รายการ (หากต้องการใช้ต่อ ต้องนำอุปกรณ์มาตรวจสภาพและทำเรื่องต่ออายุที่สโมสรฯ)</p>
          </div>
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <h4 className="font-bold text-gray-900 mb-1">เวลาให้บริการ</h4>
             <p>วันจันทร์ - วันศุกร์ เวลา 08:30 - 16:30 น. (ยกเว้นวันหยุดราชการและวันหยุดนักขัตฤกษ์)</p>
          </div>
        </div>
      )
    },
    {
      title: '3. รายละเอียดและข้อจำกัดในการยืม',
      icon: <BookOpen size={18} />,
      content: (
         <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 font-medium">
          <li>ผู้ยืม 1 ท่าน สามารถยืมอุปกรณ์กีฬาได้สูงสุดไม่เกิน 3 ชิ้น/ประเภท ในแต่ละครั้ง</li>
          <li>ห้ามนำอุปกรณ์กีฬาไปใช้ผิดวัตถุประสงค์ หรือภายนอกกิจกรรมที่เกี่ยวข้องกับการกีฬาและการออกกำลังกาย</li>
          <li className="text-rose-600 font-bold">ไม่อนุญาตให้โอนสิทธิ์ หรือส่งมอบอุปกรณ์ให้ผู้อื่นนำไปใช้งานต่อ ผู้ยืมตามชื่อในระบบต้องรับผิดชอบอุปกรณ์นั้น ๆ แต่เพียงผู้เดียว</li>
        </ul>
      )
    },
    {
      title: '4. ระบบคะแนนโทษ (Penalty Points) และความรับผิดชอบ',
      icon: <AlertTriangle size={18} />,
      content: (
        <div className="space-y-4 text-sm text-gray-700 font-medium">
          <p>ระบบมีการบันทึก "คะแนนโทษ" ตามพฤติกรรมการใช้งาน หากสะสมแต้มโทษถึงเกณฑ์ที่กำหนด จะมีบทลงโทษดังนี้:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-amber-900 flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg font-black shrink-0">100 แต้ม</div>
                <div className="text-xs font-bold">ระงับสิทธิ์การใช้งานระบบ 7 วัน</div>
             </div>
             <div className="bg-amber-100 p-3 rounded-xl border border-amber-200 text-amber-900 flex items-center gap-3">
                <div className="bg-amber-200 p-2 rounded-lg font-black shrink-0">200 แต้ม</div>
                <div className="text-xs font-bold">ระงับสิทธิ์การใช้งานระบบ 14 วัน</div>
             </div>
             <div className="bg-orange-100 p-3 rounded-xl border border-orange-200 text-orange-900 flex items-center gap-3">
                <div className="bg-orange-200 p-2 rounded-lg font-black shrink-0">300 แต้ม</div>
                <div className="text-xs font-bold">ระงับสิทธิ์การใช้งานระบบ 30 วัน</div>
             </div>
             <div className="bg-rose-100 p-3 rounded-xl border border-rose-200 text-rose-900 flex items-center gap-3">
                <div className="bg-rose-200 p-2 rounded-lg font-black shrink-0 text-rose-700">500 แต้ม</div>
                <div className="text-xs font-bold text-rose-800">แบนถาวร (ตัดสิทธิ์ตลอดชีพ)</div>
             </div>
          </div>
          <h4 className="font-bold text-gray-900 mt-4 border-t border-gray-100 pt-4">มาตรการความรับผิดชอบและบทลงโทษเฉพาะกรณี:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>การส่งคืนล่าช้ากว่ากำหนด:</strong> หักคะแนนโทษสะสมตามจำนวนวันที่เกินกำหนด</li>
            <li><strong>อุปกรณ์ชำรุด (จากการใช้งานผิดวิธี หรือประมาทเลินเล่อ):</strong> ผู้ยืมต้องรับผิดชอบค่าซ่อมแซมตามจริง หรือจัดหาอุปกรณ์ทดแทนในรุ่นและคุณภาพเทียบเท่า พร้อมถูกหักคะแนนโทษสะสม</li>
            <li className="bg-rose-50 p-3 rounded-xl border border-rose-100 mt-2">
              <strong className="text-rose-800 flex items-center gap-1.5 mb-1"><Ban size={14}/> กรณีขโมยอุปกรณ์ หรือ อุปกรณ์สูญหาย:</strong>
              <ul className="list-disc pl-5 space-y-1 text-rose-700">
                <li className="font-bold">แบนถาวรทันที (Permanent Ban) โดยไม่มีข้อยกเว้น</li>
                <li>ผู้ยืมต้องรับผิดชอบชดใช้ตามมูลค่าจริงของอุปกรณ์ หรือจัดซื้ออุปกรณ์ใหม่รุ่นเดิมมาทดแทนภายใน 14 วัน</li>
                <li>สโมสรนักศึกษาขอสงวนสิทธิ์ในการส่งเรื่องให้ทางคณะวิทยาศาสตร์หรือมหาวิทยาลัยฯ เพื่อพิจารณาลงโทษทางวินัยนักศึกษาต่อไป</li>
              </ul>
            </li>
          </ol>
        </div>
      )
    },
    {
      title: '5. ข้อปฏิบัติในการรับ-ส่งคืนอุปกรณ์',
      icon: <FileText size={18} />,
      content: (
        <ul className="list-disc pl-5 space-y-3 text-sm text-gray-700 font-medium">
          <li><strong>ก่อนรับอุปกรณ์:</strong> ผู้ยืมมีหน้าที่ตรวจสอบสภาพอุปกรณ์ร่วมกับเจ้าหน้าที่ หากพบรอยชำรุดหรือตำหนิ ต้องแจ้งให้เจ้าหน้าที่บันทึกไว้ในระบบทันที</li>
          <li><strong>การคืนอุปกรณ์:</strong> ต้องทำความสะอาดอุปกรณ์เบื้องต้นให้เรียบร้อยก่อนส่งคืน และต้องส่งคืนกับเจ้าหน้าที่สโมสรฯ เพื่อให้เจ้าหน้าที่กด "ยืนยันการรับคืน" ในระบบเท่านั้น <span className="text-rose-600 font-bold">(ห้ามวางอุปกรณ์ทิ้งไว้โดยไม่แจ้งเจ้าหน้าที่เด็ดขาด)</span></li>
        </ul>
      )
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="bg-slate-900 px-6 py-5 text-white flex items-center gap-3">
         <div className="p-2 bg-white/10 rounded-xl">
           <BookOpen size={20} className="text-[#e0ac04]" />
         </div>
         <div>
           <h3 className="font-black text-lg">กฎระเบียบและเงื่อนไขการยืม-คืนอุปกรณ์กีฬา</h3>
           <p className="text-xs text-white/70 font-medium">สโมสรนักศึกษา คณะวิทยาศาสตร์ มหาวิทยาลัยราชภัฏพระนคร (SCI-SPORTS BORROW SYSTEM)</p>
         </div>
      </div>
      
      <div className="p-2 sm:p-4">
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div key={index} className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-gray-300 transition-colors">
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-5 py-4 flex items-center justify-between bg-white focus:outline-none"
              >
                <div className="flex items-center gap-3 text-gray-900">
                  <div className={`p-2 rounded-xl transition-colors ${openSection === index ? 'bg-[#397d54] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {section.icon}
                  </div>
                  <span className="font-bold text-sm sm:text-base text-left">{section.title}</span>
                </div>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-300 ${openSection === index ? 'rotate-180' : ''}`} 
                />
              </button>
              
              <AnimatePresence>
                {openSection === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-gray-50">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-blue-900 text-sm font-medium">
           <div className="mt-0.5 shrink-0">
             <AlertTriangle size={16} className="text-blue-600" />
           </div>
           <p>
             <strong>หมายเหตุ:</strong> กรณีที่คณะฯ หรือสโมสรนักศึกษามีการจัดกิจกรรมการแข่งขันกีฬาภายใน ขอสงวนสิทธิ์ในการงดให้บริการยืมอุปกรณ์ทั่วไปชั่วคราว โดยจะประกาศให้ทราบล่วงหน้าผ่านหน้าเว็บไซต์
           </p>
        </div>
      </div>
    </div>
  );
}
