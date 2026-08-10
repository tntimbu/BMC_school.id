import React from 'react';
import { ShieldCheck, Key, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const AnimatedKeyKeeper: React.FC = () => {
  return (
    <div className="relative mt-6 p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-2xl overflow-hidden group">
      {/* Background glow effects */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes floatKeeper {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-1.5deg);
          }
        }

        @keyframes swingKeyHand {
          0%, 100% {
            transform: rotate(-4deg) translateY(0px);
          }
          50% {
            transform: rotate(14deg) translateY(-4px);
          }
        }

        @keyframes pulseKeyGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.7)) drop-shadow(0 0 18px rgba(245, 158, 11, 0.4));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 22px rgba(251, 191, 36, 0.95)) drop-shadow(0 0 35px rgba(245, 158, 11, 0.7));
            transform: scale(1.08);
          }
        }

        @keyframes floatParticle1 {
          0%, 100% { transform: translateY(0px) scale(0.9); opacity: 0.4; }
          50% { transform: translateY(-12px) scale(1.2); opacity: 0.9; }
        }

        @keyframes floatParticle2 {
          0%, 100% { transform: translateY(0px) scale(1.1); opacity: 0.8; }
          50% { transform: translateY(-15px) scale(0.8); opacity: 0.3; }
        }

        @keyframes blinkDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .anim-keeper {
          animation: floatKeeper 4.5s ease-in-out infinite;
        }

        .anim-key-hand {
          animation: swingKeyHand 3s ease-in-out infinite;
          transform-origin: 130px 140px;
        }

        .anim-key-glow {
          animation: pulseKeyGlow 2.5s ease-in-out infinite;
          transform-origin: 190px 85px;
        }

        .anim-part-1 {
          animation: floatParticle1 3.2s ease-in-out infinite;
        }

        .anim-part-2 {
          animation: floatParticle2 2.7s ease-in-out infinite 0.8s;
        }

        .anim-blink {
          animation: blinkDot 1.8s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
        
        {/* Animated Character Holding Key SVG */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          
          {/* Floating Sparkles & Security Particles behind */}
          <div className="absolute top-2 left-4 anim-part-1">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="absolute bottom-4 right-2 anim-part-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div className="absolute top-1/2 left-1 -translate-y-1/2 anim-part-1">
            <div className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 backdrop-blur">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Character Vector Art */}
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full drop-shadow-2xl anim-keeper"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
              <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="keyGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
              <linearGradient id="shieldBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <filter id="glowKey" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing Security Shield Aura in Background */}
            <circle cx="120" cy="120" r="95" fill="url(#shieldBgGrad)" stroke="#334155" strokeWidth="2" />
            <circle cx="120" cy="120" r="85" stroke="#3B82F6" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />

            {/* Character Torso & Jacket */}
            <path
              d="M75 195 C75 155, 90 140, 120 140 C150 140, 165 155, 165 195 Z"
              fill="url(#bodyGrad)"
            />
            {/* Jacket collar & details */}
            <path
              d="M90 142 L120 175 L150 142 L138 140 L120 160 L102 140 Z"
              fill="#1E293B"
            />
            {/* Lanyard / ID Badge */}
            <path d="M112 140 L115 168 L125 168 L128 140" fill="#F59E0B" />
            <rect x="111" y="168" width="18" height="22" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="1.5" />
            <rect x="114" y="172" width="12" height="6" rx="1" fill="#BAE6FD" />
            <circle cx="120" cy="183" r="2" fill="#FFFFFF" />

            {/* Character Head & Hair */}
            {/* Neck */}
            <rect x="111" y="125" width="18" height="18" rx="4" fill="#FBCFE8" />
            {/* Face */}
            <ellipse cx="120" cy="110" rx="26" ry="28" fill="#FED7AA" />
            
            {/* Hair */}
            <path
              d="M92 108 C92 82, 110 75, 120 75 C135 75, 148 82, 148 108 C148 92, 138 82, 120 82 C102 82, 92 95, 92 108 Z"
              fill="#1E1B4B"
            />
            <path
              d="M92 100 C92 80, 112 72, 128 75 C142 78, 149 90, 148 105 C144 90, 132 82, 120 82 C105 82, 95 90, 92 100 Z"
              fill="#312E81"
            />

            {/* Eyes (Friendly expression with blinking light) */}
            <circle cx="110" cy="108" r="3.5" fill="#1E1B4B" />
            <circle cx="130" cy="108" r="3.5" fill="#1E1B4B" />
            <circle cx="111.5" cy="106.5" r="1.2" fill="#FFFFFF" />
            <circle cx="131.5" cy="106.5" r="1.2" fill="#FFFFFF" />

            {/* Eyebrows */}
            <path d="M105 101 Q110 98 115 101" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />
            <path d="M125 101 Q130 98 135 101" stroke="#1E1B4B" strokeWidth="2" strokeLinecap="round" />

            {/* Cheeks & Smile */}
            <ellipse cx="104" cy="115" rx="3.5" ry="2" fill="#F43F5E" opacity="0.3" />
            <ellipse cx="136" cy="115" rx="3.5" ry="2" fill="#F43F5E" opacity="0.3" />
            <path d="M114 118 Q120 124 126 118" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Left Arm (holding security tablet/pad) */}
            <path d="M80 155 Q65 170 82 185" stroke="#1D4ED8" strokeWidth="14" strokeLinecap="round" fill="none" />
            <rect x="58" y="165" width="22" height="28" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" transform="rotate(-15 69 179)" />
            <circle cx="68" cy="178" r="4" fill="#10B981" />

            {/* RIGHT ARM & HAND HOLDING THE GOLDEN KEY (ANIMATED GROUP) */}
            <g className="anim-key-hand">
              {/* Arm extending right & upward */}
              <path d="M150 150 Q175 135 185 110" stroke="#1D4ED8" strokeWidth="16" strokeLinecap="round" fill="none" />
              {/* Hand */}
              <circle cx="185" cy="106" r="9" fill="#FED7AA" />

              {/* HUGE GOLDEN KEY (ANIMATED GLOW) */}
              <g className="anim-key-glow" filter="url(#glowKey)">
                {/* Key Ring / Bow */}
                <circle cx="150" cy="85" r="18" fill="none" stroke="url(#keyGoldGrad)" strokeWidth="7" />
                <circle cx="150" cy="85" r="10" fill="none" stroke="#FEF08A" strokeWidth="2" />
                {/* Key Shaft */}
                <rect x="165" y="81" width="55" height="8" rx="3" fill="url(#keyGoldGrad)" />
                {/* Key Teeth / Bitting */}
                <path d="M200 89 L200 102 L206 102 L206 89 Z" fill="url(#keyGoldGrad)" />
                <path d="M210 89 L210 105 L217 105 L217 89 Z" fill="url(#keyGoldGrad)" />
                
                {/* Key Shine highlights */}
                <line x1="168" y1="83" x2="215" y2="83" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
                <circle cx="150" cy="85" r="14" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 20" opacity="0.8" />
              </g>
            </g>

          </svg>
        </div>

        {/* Text Details & Security Status */}
        <div className="flex-1 space-y-2 text-left">
          
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="anim-blink absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Otentikasi Kunci Terenkripsi
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <span>Akses Hanya Dengan Kunci Sah</span>
            <Key className="w-4 h-4 text-amber-400" />
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Sistem SIAKAD Yayasan menggunakan perlindungan akun tingkat tinggi. Setiap staf, guru, orang tua, dan siswa wajib masuk menggunakan kredensial terdaftar atau Google SSO.
          </p>

          <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
            <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Proteksi Sesi Aktif</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dukungan Google Login</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
