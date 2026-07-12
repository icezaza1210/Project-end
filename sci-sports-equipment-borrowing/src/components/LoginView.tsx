import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Trophy, Shield, User, GraduationCap, ArrowRight, Sparkles, Check } from 'lucide-react';
import { DEPARTMENTS } from '../data';

interface LoginViewProps {
  onLogin: (user: { name: string; id: string; role: 'student' | 'staff'; department?: string }) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [role, setRole] = useState<'student' | 'staff'>('student');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [staffCode, setStaffCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'student') {
      if (!name.trim()) {
        setError('กรุณาระบุชื่อ-นามสกุลจริงของคุณ');
        return;
      }
      if (!studentId.trim() || studentId.length < 8) {
        setError('กรุณาระบุรหัสนักศึกษาอย่างน้อย 8 หลัก');
        return;
      }
      onLogin({
        name: name.trim(),
        id: studentId.trim(),
        role: 'student',
        department: selectedDept,
      });
    } else {
      if (!name.trim()) {
        setError('กรุณาระบุชื่อสตาฟฟ์ผู้ดูแล');
        return;
      }
      if (staffCode !== 'staff123' && staffCode.trim() !== '') {
        setError('รหัสผ่านสตาฟฟ์ไม่ถูกต้อง (กรุณาใช้รหัสแนะนำ: staff123 หรือเว้นว่างไว้เพื่อทดสอบ)');
        return;
      }
      onLogin({
        name: name.trim(),
        id: staffCode || 'STAFF-01',
        role: 'staff',
      });
    }
  };

  // Quick preset login helper
  const handleQuickLogin = (type: 'student' | 'staff') => {
    if (type === 'student') {
      onLogin({
        name: 'ณัฐพงษ์ ยอดวิทยา',
        id: '660510999',
        role: 'student',
        department: 'วิทยาการคอมพิวเตอร์ (Computer Science)',
      });
    } else {
      onLogin({
        name: 'สตาฟฟ์สมโภช ห้องสโมฯ',
        id: 'STAFF-MAIN',
        role: 'staff',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e3e3e4] px-4 py-12 relative overflow-hidden font-sans" id="login-container">
      {/* Decorative Sporty Geometry Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#397d54]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e0ac04]/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-[#e3e3e4] rounded-3xl overflow-hidden shadow-xl relative z-10"
        id="login-card"
      >
        {/* Dynamic Sporty Header */}
        <div className="bg-[#397d54] text-white p-8 text-center relative overflow-hidden border-b-4 border-[#e0ac04]" id="login-header-band">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-800/50 via-[#397d54] to-[#397d54]/90 opacity-90"></div>
          
          {/* Futuristic Grid Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>

          <div className="relative z-10 space-y-3">
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto border border-white/20 shadow-md backdrop-blur-sm"
            >
              <Trophy className="text-[#e0ac04]" size={28} />
            </motion.div>
            <div>
              <h2 className="text-xl font-black tracking-widest uppercase text-white">SCI-SPORTS BORROW</h2>
              <p className="text-xs text-emerald-100 font-light mt-1">ระบบจองยืมอุปกรณ์กีฬา คณะวิทยาศาสตร์ มรภ.พระนคร</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6" id="login-body">
          {/* Role selector Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200" id="role-selector-tab">
            <button
              type="button"
              onClick={() => { setRole('student'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                role === 'student'
                  ? 'bg-white text-[#397d54] shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              id="role-btn-student"
            >
              <GraduationCap size={16} />
              นักศึกษา (Student)
            </button>
            <button
              type="button"
              onClick={() => { setRole('staff'); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                role === 'staff'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              id="role-btn-staff"
            >
              <Shield size={15} />
              สตาฟฟ์ (Staff Admin)
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl"
              id="login-error"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="login-form-fields">
            {role === 'student' ? (
              /* STUDENT FORM */
              <div className="space-y-4" id="form-student-fields">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">ชื่อ - นามสกุลจริง</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      required
                      placeholder="เช่น ณัฐพงษ์ ยอดวิทยา"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e3e3e4] rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition font-medium"
                      id="input-login-student-name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">รหัสนักศึกษา (Student ID)</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="ระบุรหัสนักศึกษา เช่น 660510999"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-[#e3e3e4] rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition font-bold"
                    id="input-login-student-id"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">ภาควิชา / คณะวิทยาศาสตร์</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-[#e3e3e4] rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition text-gray-700 font-medium"
                    id="input-login-student-dept"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              /* STAFF FORM */
              <div className="space-y-4" id="form-staff-fields">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">ชื่อสตาฟฟ์สโมสรฯ</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      required
                      placeholder="เช่น พี่สมโภช สโมฯวิทยา"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e3e3e4] rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition font-medium"
                      id="input-login-staff-name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block uppercase tracking-wider">รหัสผ่านสตาฟฟ์ (Staff Access Code)</label>
                  <input
                    type="password"
                    placeholder="กรอกรหัส หรือเว้นว่าง (รหัสแนะนำ: staff123)"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-[#e3e3e4] rounded-xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-1 focus:ring-[#397d54] transition font-mono"
                    id="input-login-staff-pass"
                  />
                  <span className="text-[10px] text-gray-400 block">*รหัสผ่านสำหรับเปิดแดชบอร์ดจัดการระบบ</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#397d54] hover:bg-[#2c5f3f] text-white text-xs font-extrabold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md cursor-pointer mt-6"
              id="btn-login-submit"
            >
              เข้าสู่ระบบตรวจสอบและจองคิว
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Sandbox Login Section */}
          <div className="border-t border-gray-100 pt-5 space-y-3" id="quick-login-section">
            <div className="flex items-center gap-2" id="quick-login-label">
              <span className="h-px bg-gray-200 flex-1"></span>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
                <Sparkles size={11} className="text-[#e0ac04]" />
                ทางลัดสำหรับทดสอบระบบ (Sandbox Bypass)
              </span>
              <span className="h-px bg-gray-200 flex-1"></span>
            </div>

            <div className="grid grid-cols-2 gap-3" id="quick-login-buttons">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-[#397d54] rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition active:scale-[0.97]"
                id="btn-quick-student"
              >
                <span>กดปุ่มเดียวในฐานะ</span>
                <span className="text-gray-900">นักศึกษาจำลอง</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff')}
                className="py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-100 text-amber-700 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center gap-0.5 transition active:scale-[0.97]"
                id="btn-quick-staff"
              >
                <span>กดปุ่มเดียวในฐานะ</span>
                <span className="text-gray-900">พี่สตาฟฟ์จำลอง</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom micro copy */}
        <div className="bg-gray-50 border-t border-gray-100 py-4 px-8 text-center text-[10px] text-gray-400 font-medium" id="login-footer">
          สโมสรนักศึกษา คณะวิทยาศาสตร์ มหาวิทยาลัยราชภัฏพระนคร © {new Date().getFullYear()}
        </div>
      </motion.div>
    </div>
  );
}
