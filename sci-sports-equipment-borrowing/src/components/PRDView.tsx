import { motion } from 'motion/react';
import { FileText, BookOpen, Layers, ShieldCheck, HelpCircle, Palette } from 'lucide-react';

export default function PRDView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
      id="prd-root"
    >
      {/* PRD Header */}
      <div className="bg-[#397d54] text-white p-8 rounded-2xl shadow-sm relative overflow-hidden" id="prd-header-banner">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-6">
          <FileText size={240} />
        </div>
        <div className="relative z-10" id="prd-header-content">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e0ac04] text-gray-900 text-xs font-semibold rounded-full mb-3" id="prd-doc-badge">
            <BookOpen size={12} />
            DOCUMENT
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Product Requirement Document (PRD)
          </h1>
          <p className="text-emerald-100 max-w-2xl text-sm font-light">
            เอกสารกำหนดความต้องการของระบบยืม-คืนอุปกรณ์กีฬาออนไลน์ ห้องสโมสรนักศึกษา คณะวิทยาศาสตร์
            สไตล์มินิมอล-สปอร์ต (Minimalist Sporty Concepts)
          </p>
        </div>
      </div>

      {/* Main PRD Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="prd-body-grid">
        {/* Left Side: Index Navigation & Theme Info */}
        <div className="space-y-6 lg:col-span-1" id="prd-sidebar">
          {/* Style Guide Panel */}
          <div className="bg-white border border-[#e3e3e4] rounded-2xl p-6 shadow-sm" id="prd-style-guide">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-[#e3e3e4] pb-2">
              <Palette className="text-[#397d54]" size={18} />
              UI/UX Style Guide
            </h3>
            <div className="space-y-4" id="prd-style-details">
              <div>
                <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">Color Distribution</p>
                <div className="flex rounded-lg overflow-hidden h-6" id="prd-color-bar">
                  <div className="bg-[#e3e3e4] w-[60%] flex items-center justify-center text-[10px] text-gray-600 font-bold" title="Light Slate Gray (60%)">60%</div>
                  <div className="bg-[#397d54] w-[30%] flex items-center justify-center text-[10px] text-white font-bold" title="Science Deep Green (30%)">30%</div>
                  <div className="bg-[#e0ac04] w-[10%] flex items-center justify-center text-[10px] text-gray-900 font-bold" title="Sporty Gold (10%)">10%</div>
                </div>
              </div>

              <div className="space-y-2 text-xs" id="prd-color-legend">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-[#e3e3e4] border border-gray-300"></div>
                  <div>
                    <p className="font-bold text-gray-800">Background (60%)</p>
                    <p className="text-gray-500">#e3e3e4 - มินิมอล, สว่างสบายตา, ทันสมัย</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-[#397d54]"></div>
                  <div>
                    <p className="font-bold text-[#397d54]">Primary Identity (30%)</p>
                    <p className="text-gray-500">#397d54 - เขียวคณะวิทยาศาสตร์และสนามกีฬา</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-[#e0ac04]"></div>
                  <div>
                    <p className="font-bold text-[#e0ac04]">Accent & Highlights (10%)</p>
                    <p className="text-gray-500">#e0ac04 - ทองสปอร์ต, สถานะจอง, จุดดึงสายตา</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e3e3e4] pt-4 mt-2" id="prd-concept-detail">
                <h4 className="text-xs font-bold text-gray-800 uppercase mb-1">Sporty Concept</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  เน้นการจัดวาง Layout ที่มีพลัง (Dynamic Margins) ใช้เส้นสายคมชัด ขอบโค้งมนปานกลาง สะท้อนภาพลักษณ์คนรุ่นใหม่ที่รักกีฬาและวิทยาศาสตร์
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics of Requirements */}
          <div className="bg-white border border-[#e3e3e4] rounded-2xl p-6 shadow-sm" id="prd-metrics">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-[#e3e3e4] pb-2">
              <Layers className="text-[#397d54]" size={18} />
              รายละเอียดคุณลักษณะ
            </h3>
            <ul className="space-y-3 text-xs text-gray-600" id="prd-req-list">
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#397d54] mt-1.5"></span>
                <span>รองรับการจองออนไลน์แบบระบุวันและเวลาส่งคืน</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#397d54] mt-1.5"></span>
                <span>ติดตามสถานะอุปกรณ์เรียลไทม์ (ว่าง, จอง, ยืม, ซ่อม)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#397d54] mt-1.5"></span>
                <span>ระบบสตาฟฟ์สโมสรนักศึกษา สำหรับอนุมัติและจัดการคืน</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#397d54] mt-1.5"></span>
                <span>บันทึกประวัติกิจกรรมล่าสุดในสโมสรเพื่อความโปร่งใส</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Detailed PRD Document Content */}
        <div className="lg:col-span-2 space-y-6" id="prd-details-main">
          {/* Section 1: Overview */}
          <div className="bg-white border border-[#e3e3e4] rounded-2xl p-6 shadow-sm space-y-4" id="prd-section-overview">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-[#e3e3e4] pb-2">
              <span className="text-[#397d54]">01.</span> บทนำและวัตถุประสงค์ (Overview)
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed" id="prd-overview-text">
              <p>
                ห้องสโมสรนักศึกษา คณะวิทยาศาสตร์ มีหน้าที่ให้บริการยืม-คืนอุปกรณ์กีฬาแก่นักศึกษาเพื่อส่งเสริมกิจกรรมและการออกกำลังกาย อย่างไรก็ตาม ระบบเดิมที่เป็นการจดกระดาษมักมีปัญหา <strong className="text-[#397d54]">อุปกรณ์สูญหาย การจองชนกัน และนักศึกษาไม่ทราบสถานะของอุปกรณ์ที่ว่างอยู่จริง</strong>
              </p>
              <p>
                เว็บแอปพลิเคชันนี้จึงได้รับการพัฒนาขึ้นเพื่อแก้ไขปัญหาดังกล่าว โดยเน้นให้สตาฟฟ์สโมสรฯ และนักศึกษาสามารถเข้าใช้งานและสื่อสารสถานะของอุปกรณ์กีฬาร่วมกันได้อย่างเป็นระบบ ทันทีแบบเรียลไทม์
              </p>
            </div>
          </div>

          {/* Section 2: Core User Workflows */}
          <div className="bg-white border border-[#e3e3e4] rounded-2xl p-6 shadow-sm space-y-4" id="prd-section-workflows">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-[#e3e3e4] pb-2">
              <span className="text-[#397d54]">02.</span> ขั้นตอนการทำงานระบบ (Core Workflows)
            </h2>
            <div className="space-y-4" id="prd-workflow-details">
              {/* Step 1 */}
              <div className="flex gap-4" id="prd-flow-1">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#397d54] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">ตรวจสอบสถานะอุปกรณ์ (Real-time Discovery)</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    นักศึกษาเข้ามาตรวจสอบว่า อุปกรณ์ที่ต้องการ (เช่น ลูกบาส ไม้แบด) ว่างอยู่จำนวนเท่าใด มีของในตู้สโมสรฯ หรือไม่
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4" id="prd-flow-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#397d54] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">กรอกฟอร์มจองออนไลน์ (Online Booking Form)</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    ระบุรหัสนักศึกษา ชื่อ ภาควิชา อุปกรณ์ และจำนวนที่ต้องการยืม พร้อมกำหนดวันเวลาคืน ระบบจะจองอุปกรณ์ชั่วคราวและออกบัตรคิว (Digital Booking Ticket)
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4" id="prd-flow-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e0ac04] text-gray-900 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">รับอุปกรณ์ที่สโมสรฯ (Staff Verification)</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    สตาฟฟ์ห้องสโมสรฯ อนุมัติการจองในระบบเพื่อเปลี่ยนสถานะจาก <span className="text-[#e0ac04] font-semibold">จองแล้ว (Reserved)</span> เป็น <span className="text-gray-700 font-semibold">กำลังยืมใช้งาน (Borrowed/Active)</span> ณ ตอนส่งมอบอุปกรณ์จริง
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4" id="prd-flow-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#397d54] text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">ส่งคืนและเพิ่มสต็อก (Return Cycle)</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    เมื่อนำอุปกรณ์มาคืน สตาฟฟ์จะกดยืนยันการส่งคืนในแดชบอร์ดสตาฟฟ์ อุปกรณ์จะเด้งกลับเข้าสู่สต็อก <span className="text-[#397d54] font-semibold">ว่างพร้อมยืม (Available)</span> ทันที
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Technical Integrity & Validation */}
          <div className="bg-white border border-[#e3e3e4] rounded-2xl p-6 shadow-sm space-y-4" id="prd-section-integrity">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 border-b border-[#e3e3e4] pb-2">
              <span className="text-[#397d54]">03.</span> ความน่าเชื่อถือของระบบข้อมูล (Security & Integrity)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="prd-integrity-cards">
              <div className="p-4 rounded-xl bg-gray-50 border border-[#e3e3e4]" id="prd-integrity-1">
                <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold text-xs uppercase">
                  <ShieldCheck size={16} className="text-[#397d54]" />
                  ป้องกันสิทธิ์ยืมเกินสต็อก
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  ระบบจะไม่ยอมให้นักศึกษากรอกจำนวนอุปกรณ์เกินกว่าจำนวนที่มีอยู่จริง ณ ปัจจุบัน ฟอร์มจะแสดงคำแจ้งเตือนตัวแดงและปิดปุ่มส่งทันที
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-[#e3e3e4]" id="prd-integrity-2">
                <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold text-xs uppercase">
                  <HelpCircle size={16} className="text-[#e0ac04]" />
                  ระบบสืบสวนประวัติย้อนหลัง
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  การเคลื่อนไหวทุกอย่าง (สร้างใบจอง, อนุมัติยืม, คืนของ, ย้ายไปซ่อม) จะสร้างบันทึกประวัติการกระทำโดยไม่สามารถลบได้ เพื่อใช้สืบสวนหากของหาย
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
