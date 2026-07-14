import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Trophy, Shield, User, GraduationCap, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { DEPARTMENTS } from '../data';

interface LoginViewProps {
  onLogin: (user: { name: string; id: string; role: 'student' | 'staff'; department?: string }) => void;
  onBack?: () => void;
}

export default function LoginView({ onLogin, onBack }: LoginViewProps) {
  const [role, setRole] = useState<'student' | 'staff'>('student');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);
  const [staffCode, setStaffCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');

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
      if (isRegister && !phone.trim()) {
        setError('กรุณาระบุเบอร์โทรศัพท์สำหรับติดต่อ');
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
      if (isRegister && staffCode.trim() === '') {
        setError('กรุณาตั้งรหัสผ่านสำหรับสตาฟฟ์');
        return;
      }
      if (!isRegister && staffCode !== 'staff123' && staffCode.trim() !== '') {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-8 md:py-12 relative overflow-hidden font-sans" id="login-container">
      {/* Premium Decorative Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] relative z-10 overflow-hidden"
        id="login-card"
      >
        {onBack && (
          <button
            onClick={onBack}
            type="button"
            className="absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/50 text-gray-500 hover:text-gray-900 hover:bg-white backdrop-blur-md transition-all shadow-sm"
            title="กลับหน้าแรก"
          >
            <ArrowLeft size={16} />
          </button>
        )}

        {/* Dynamic Sporty Header - Redesigned */}
        <div className="px-8 pt-10 pb-8 text-center relative" id="login-header-band">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, type: 'spring', bounce: 0.5 }}
              className="w-16 h-16 bg-gradient-to-br from-[#397d54] to-[#245236] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,white_25%,white_50%,transparent_50%,transparent_75%,white_75%,white_100%)] bg-[length:4px_4px]"></div>
              <Trophy size={28} className="relative z-10 text-emerald-50 drop-shadow-sm" />
            </motion.div>
            
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black tracking-tight text-gray-900">
                SCI-SPORTS
              </h2>
              <p className="text-[11px] font-medium text-emerald-700/80 uppercase tracking-widest bg-emerald-50 inline-block px-3 py-1 rounded-full border border-emerald-100/50">
                Equipment Borrow System
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8 space-y-7" id="login-body">
          {/* Role selector Tabs - Pill style */}
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl backdrop-blur-sm shadow-inner" id="role-selector-tab">
            <button
              type="button"
              onClick={() => { setRole('student'); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                role === 'student'
                  ? 'bg-white text-[#397d54] shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
              id="role-btn-student"
            >
              <GraduationCap size={16} className={role === 'student' ? 'text-[#397d54]' : 'opacity-70'} />
              นักศึกษา
            </button>
            <button
              type="button"
              onClick={() => { setRole('staff'); setIsRegister(false); setError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                role === 'staff'
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
              id="role-btn-staff"
            >
              <Shield size={15} className={role === 'staff' ? 'text-gray-900' : 'opacity-70'} />
              สตาฟฟ์
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 bg-rose-50/80 backdrop-blur-sm border border-rose-100 text-rose-700 text-[11px] font-medium rounded-2xl flex items-start gap-2.5 shadow-sm"
              id="login-error"
            >
              <div className="mt-0.5 bg-rose-200/50 p-1 rounded-full text-rose-600 flex-shrink-0">
                <ArrowRight size={10} />
              </div>
              <p className="leading-relaxed">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" id="login-form-fields">
            {role === 'student' ? (
              /* STUDENT FORM */
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4" 
                id="form-student-fields"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider ml-1">ชื่อ - นามสกุลจริง</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#397d54] transition-colors" size={16} />
                    <input
                      type="text"
                      required
                      placeholder="เช่น ณัฐพงษ์ ยอดวิทยา"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-4 focus:ring-[#397d54]/10 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm"
                      id="input-login-student-name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider ml-1">รหัสนักศึกษา (Student ID)</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="ระบุรหัสนักศึกษา เช่น 660510999"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-4 focus:ring-[#397d54]/10 transition-all font-bold text-gray-800 placeholder-gray-400 shadow-sm font-mono tracking-wide"
                    id="input-login-student-id"
                  />
                </div>

                {isRegister && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 overflow-hidden">
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider ml-1">เบอร์โทรศัพท์ติดต่อ</label>
                      <input
                        type="tel"
                        required
                        placeholder="เช่น 0812345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-4 focus:ring-[#397d54]/10 transition-all font-mono tracking-wide text-gray-800 placeholder-gray-400 shadow-sm"
                        id="input-register-phone"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider ml-1">ภาควิชา / คณะวิทยาศาสตร์</label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full px-3.5 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-[#397d54] focus:ring-4 focus:ring-[#397d54]/10 transition-all text-gray-700 font-medium shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_12px_center] bg-no-repeat pr-10"
                        id="input-login-student-dept"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              /* STAFF FORM */
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4" 
                id="form-staff-fields"
              >
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider ml-1">ชื่อสตาฟฟ์สโมสรฯ</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={16} />
                    <input
                      type="text"
                      required
                      placeholder="เช่น พี่สมโภช สโมฯวิทยา"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm"
                      id="input-login-staff-name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-end ml-1 mb-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">รหัสผ่านสตาฟฟ์</label>
                  </div>
                  <input
                    type="password"
                    placeholder="กรอกรหัส หรือเว้นว่าง (แนะนำ: staff123)"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:border-gray-900 focus:ring-4 focus:ring-gray-900/10 transition-all font-mono tracking-wide text-gray-800 placeholder-gray-400 shadow-sm"
                    id="input-login-staff-pass"
                  />
                </div>
              </motion.div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3.5 text-white text-xs font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer relative overflow-hidden group ${
                  role === 'student' ? 'bg-[#397d54] hover:bg-[#2c5f3f] shadow-emerald-900/20' : 'bg-gray-900 hover:bg-black shadow-gray-900/20'
                }`}
                id="btn-login-submit"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-2xl"></div>
                <span className="relative z-10">{isRegister ? 'สมัครสมาชิกและเข้าสู่ระบบ' : 'เข้าสู่ระบบ'}</span>
                <ArrowRight size={15} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {role === 'student' && (
              <div className="text-center text-[11px] text-gray-500 mt-5 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5">
                {isRegister ? (
                  <>
                    <span>มีบัญชีอยู่แล้ว?</span>
                    <button type="button" onClick={() => setIsRegister(false)} className="font-bold hover:underline cursor-pointer transition-colors text-[#397d54]">
                      เข้าสู่ระบบ
                    </button>
                  </>
                ) : (
                  <>
                    <span>ยังไม่มีบัญชี?</span>
                    <button type="button" onClick={() => setIsRegister(true)} className="font-bold hover:underline cursor-pointer transition-colors text-[#397d54]">
                      ลงทะเบียนใช้งาน
                    </button>
                  </>
                )}
              </div>
            )}
          </form>

          {/* Quick Sandbox Login Section */}
          <div className="border-t border-gray-100 pt-5 mt-2 space-y-4" id="quick-login-section">
            <div className="flex items-center gap-2" id="quick-login-label">
              <span className="h-px bg-gray-200 flex-1"></span>
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
                <Sparkles size={11} className="text-[#e0ac04]" />
                โหมดทดสอบระบบ
              </span>
              <span className="h-px bg-gray-200 flex-1"></span>
            </div>

            <div className="grid grid-cols-2 gap-3" id="quick-login-buttons">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100/50 text-[#397d54] rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all active:scale-[0.97]"
                id="btn-quick-student"
              >
                <span className="opacity-70 font-medium">เข้าใช้งานแบบ</span>
                <span className="text-emerald-900 tracking-wide">นักศึกษาจำลอง</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff')}
                className="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-100/50 text-amber-700 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all active:scale-[0.97]"
                id="btn-quick-staff"
              >
                <span className="opacity-70 font-medium">เข้าใช้งานแบบ</span>
                <span className="text-amber-900 tracking-wide">พี่สตาฟฟ์จำลอง</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom micro copy */}
        <div className="bg-gray-50/80 backdrop-blur-sm border-t border-gray-100/80 py-4 px-8 text-center text-[10px] text-gray-400 font-medium relative z-10" id="login-footer">
          สโมสรนักศึกษา คณะวิทยาศาสตร์ มหาวิทยาลัยราชภัฏพระนคร © {new Date().getFullYear()}
        </div>
      </motion.div>
    </div>
  );
}
