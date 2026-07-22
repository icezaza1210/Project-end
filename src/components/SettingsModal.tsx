import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Volume2, VolumeX, MonitorSmartphone } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsModal() {
  const { 
    isSettingsOpen, setIsSettingsOpen, 
    isDarkMode, setIsDarkMode, 
    soundEnabled, setSoundEnabled, 
    playPop, t 
  } = useSettings();

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    playPop();
    setIsSettingsOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={handleClose}
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#397d54] text-white p-5 flex justify-between items-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50"></div>
             <div className="relative z-10 flex items-center gap-3">
               <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                 <MonitorSmartphone size={20} />
               </div>
               <div>
                 <h2 className="font-extrabold text-lg leading-tight">{t('ตั้งค่าระบบ', 'System Settings')}</h2>
                 <p className="text-xs text-white/80 font-medium">{t('ปรับแต่งประสบการณ์ใช้งานของคุณ', 'Customize your experience')}</p>
               </div>
             </div>
             <button 
               onClick={handleClose}
               className="relative z-10 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
             >
               <X size={18} />
             </button>
          </div>

          <div className="p-6 space-y-6">
            {/* General Settings */}
            <div className="space-y-4">
               {/* Dark Mode Toggle */}
               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-500">
                     <Moon size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-800">{t('โหมดมืด (Dark Mode)', 'Dark Mode')}</p>
                     <p className="text-[10px] text-gray-500">{t('ปรับสีหน้าจอให้ถนอมสายตา', 'Use dark theme')}</p>
                   </div>
                 </div>
                 <button 
                    onClick={() => {
                      setIsDarkMode(!isDarkMode);
                      playPop();
                    }}
                    className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-[#397d54]' : 'bg-gray-300'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                 </button>
               </div>



               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-500">
                     {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-gray-800">{t('เอฟเฟกต์เสียง (Sound Effects)', 'Sound Effects')}</p>
                     <p className="text-[10px] text-gray-500">{t('เสียงประกอบตอนกดปุ่ม', 'Sound feedback on click')}</p>
                   </div>
                 </div>
                 <button 
                    onClick={() => {
                      const nextState = !soundEnabled;
                      setSoundEnabled(nextState);
                      if (nextState) {
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                        audio.volume = 0.2;
                        audio.play().catch(() => {});
                      }
                    }}
                    className={`w-12 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-[#397d54]' : 'bg-gray-300'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'left-7' : 'left-1'}`}></div>
                 </button>
               </div>
            </div>
          </div>
          
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
