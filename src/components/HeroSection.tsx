import React from 'react';
import { ChevronDown, Calendar, MapPin, Sparkles } from 'lucide-react';
import { KazakhMedallion, KazakhDivider, KazakhCorner } from './KazakhOrnament.tsx';
import { EventSettings } from '../types.ts';

interface HeroSectionProps {
  settings: EventSettings;
  onOpenInvitation: () => void;
  onJoinRsvp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenInvitation,
  onJoinRsvp
}) => {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-[#611222]/25 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[450px] h-[220px] sm:h-[450px] bg-[#d4af37]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Luxury Frame */}
      <div className="relative z-20 max-w-2xl w-full mx-auto p-6 sm:p-12 wine-glass rounded-3xl border border-[#d4af37]/35 shadow-[0_10px_50px_rgba(0,0,0,0.65)] gold-glow">
        <KazakhCorner position="tl" className="top-3 left-3" size={44} />
        <KazakhCorner position="tr" className="top-3 right-3" size={44} />
        <KazakhCorner position="bl" className="bottom-3 left-3" size={44} />
        <KazakhCorner position="br" className="bottom-3 right-3" size={44} />

        {/* Top Medallion */}
        <div className="mb-4 flex justify-center">
          <KazakhMedallion size={74} className="animate-float-slow" />
        </div>

        {/* Small greeting label */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#3d0b17]/80 border border-[#d4af37]/40 text-[#fef08a] text-xs sm:text-sm font-medium tracking-[0.2em] uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>ҚАДІРЛІ ҚОНАҚТАР!</span>
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
        </div>

        {/* Celebrant's Name - ГҮЛДАНА */}
        <div className="mt-5 mb-1">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-[#d4af37] font-medium mb-1">
            АЯУЛЫ АНАМЫЗ
          </p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-wide gold-text-gradient drop-shadow-[0_4px_25px_rgba(212,175,55,0.45)]">
            {settings.motherName || "ГҮЛДАНА"}
          </h2>
        </div>

        <KazakhDivider className="my-3 max-w-xs mx-auto" />

        {/* 50 ЖАС МЕРЕЙТОЙЫ and ӨМІРДІҢ АЛТЫН БЕЛЕСІ */}
        <div className="my-2 relative py-1">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight gold-text-shimmer drop-shadow-[0_4px_25px_rgba(212,175,55,0.4)]">
            50 ЖАС МЕРЕЙТОЙЫ
          </h1>
          <p className="mt-2 text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase text-[#fef08a] font-medium">
            ӨМІРДІҢ АЛТЫН БЕЛЕСІ
          </p>
        </div>

        {/* Main invitation sentence */}
        <p className="mt-4 text-sm sm:text-base text-[#f3e5d8] font-light leading-relaxed max-w-xl mx-auto">
          Сіздерді аяулы анамыз <span className="text-[#fef08a] font-semibold">Гүлдананың</span> 50 жас мерейтойына арналған салтанатты мерекелік ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!
        </p>

        <KazakhDivider className="my-4 max-w-xs mx-auto" />

        {/* Date, Time and Venue Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-[#f7eee4]">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#280a13]/70 border border-[#d4af37]/30">
            <Calendar className="w-4 h-4 text-[#d4af37]" />
            <span className="font-semibold tracking-wide text-[#fef08a]">23 ҚАРАША 2026 ж.</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#280a13]/70 border border-[#d4af37]/30">
            <span className="text-xs text-[#d4af37] font-medium">БАСТАЛУЫ:</span>
            <span className="font-bold text-[#fef08a]">19:00</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#280a13]/70 border border-[#d4af37]/30">
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span className="font-medium">{settings.venueName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onOpenInvitation}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#87172f] via-[#a8203d] to-[#87172f] hover:from-[#9c1b37] hover:to-[#9c1b37] text-[#fff7d1] font-medium tracking-wide border border-[#d4af37]/60 shadow-[0_4px_20px_rgba(135,23,47,0.5)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            ШАҚЫРУДЫ АШУ
          </button>

          <button
            onClick={onJoinRsvp}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f7dc6f] to-[#d4af37] text-[#24080f] font-semibold tracking-wider hover:brightness-110 shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            ТОЙҒА ҚАТЫСУ
          </button>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <button
        onClick={onOpenInvitation}
        className="mt-8 flex flex-col items-center gap-1.5 text-[#d4af37]/75 hover:text-[#d4af37] transition-colors"
      >
        <span className="text-xs tracking-widest uppercase">Төмен қарай жылжытыңыз</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
};
