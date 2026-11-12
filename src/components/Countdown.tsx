import React, { useState, useEffect } from 'react';
import { KazakhCorner, KazakhDivider } from './KazakhOrnament.tsx';
import { Sparkles, PartyPopper } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const Countdown: React.FC = () => {
  // Target: 23 November 2026 at 19:00 Kazakhstan time (UTC+5)
  const targetDateMs = new Date('2026-11-23T19:00:00+05:00').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = Date.now();
    const diff = targetDateMs - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-14 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative wine-card rounded-3xl p-6 sm:p-10 text-center border border-[#d4af37]/40 shadow-xl overflow-hidden">
          <KazakhCorner position="tl" className="top-2.5 left-2.5" size={32} />
          <KazakhCorner position="tr" className="top-2.5 right-2.5" size={32} />
          <KazakhCorner position="bl" className="bottom-2.5 left-2.5" size={32} />
          <KazakhCorner position="br" className="bottom-2.5 right-2.5" size={32} />

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#360914] border border-[#d4af37]/35 text-[#d4af37] text-xs uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>САЛТАНАТҚА ДЕЙІНГІ УАҚЫТ</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#fef08a] gold-text-gradient mb-2">
            Мерейтойға дейін қалды
          </h2>

          <KazakhDivider className="max-w-xs mx-auto my-3" />

          {timeLeft.isPast ? (
            <div className="my-6 p-6 rounded-2xl bg-[#3d0b17] border border-[#d4af37]/50 text-center">
              <PartyPopper className="w-12 h-12 text-[#fef08a] mx-auto mb-3 animate-bounce" />
              <h3 className="text-2xl sm:text-3xl font-serif text-[#fef08a] font-bold">
                Мерейтой күні жетті!
              </h3>
              <p className="mt-2 text-[#faebd7]">
                Қадірлі қонақтар, ақ дастарханымыздың төріне қош келдіңіздер!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-4 my-6 max-w-lg mx-auto">
              {/* Days */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#1e070e]/85 border border-[#d4af37]/30 shadow-md">
                <span className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#fef08a] gold-text-gradient">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#d4af37]/80 mt-1 font-medium">
                  КҮН
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#1e070e]/85 border border-[#d4af37]/30 shadow-md">
                <span className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#fef08a] gold-text-gradient">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#d4af37]/80 mt-1 font-medium">
                  САҒАТ
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#1e070e]/85 border border-[#d4af37]/30 shadow-md">
                <span className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#fef08a] gold-text-gradient">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#d4af37]/80 mt-1 font-medium">
                  МИНУТ
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#1e070e]/85 border border-[#d4af37]/30 shadow-md">
                <span className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#fef08a] gold-text-gradient">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#d4af37]/80 mt-1 font-medium">
                  СЕКУНД
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-[#d4af37]/75">
            2026 жылдың 23 қарашасы, сағат 19:00 (Астана уақыты бойынша)
          </p>
        </div>
      </div>
    </section>
  );
};
