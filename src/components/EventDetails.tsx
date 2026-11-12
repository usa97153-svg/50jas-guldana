import React from 'react';
import { Calendar, MapPin, Clock, ExternalLink, CalendarPlus, Shirt } from 'lucide-react';
import { KazakhCorner, KazakhDivider } from './KazakhOrnament.tsx';
import { EventSettings } from '../types.ts';

interface EventDetailsProps {
  settings: EventSettings;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ settings }) => {
  // Generate .ics calendar file download
  const handleAddToCalendar = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//50 жас мерейтойы//KZ',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'SUMMARY:Гүлдана анамыздың 50 жас мерейтойы',
      'DESCRIPTION:Асыл анамыз Гүлдананың 50 жас мерейтойына арналған салтанатты мерекелік ақ дастархан.',
      'LOCATION:«Ақсезім» мейрамханасы',
      'DTSTART:20261123T140000Z',
      'DTEND:20261123T200000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', '50_zhas_mereytoi.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="event-details" className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37]">САЛТАНАТ ҚАРСАҢЫНДА</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#fef08a] gold-text-gradient mt-2">
            Мерейтой Мәліметтері
          </h2>
          <KazakhDivider className="max-w-xs mx-auto my-3" />
        </div>

        {/* 3 Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: КҮНІ */}
          <div className="relative wine-card rounded-2xl p-6 sm:p-8 text-center border border-[#d4af37]/35 shadow-lg group hover:border-[#d4af37] transition-all duration-300">
            <KazakhCorner position="tl" className="top-2 left-2" size={30} />
            <KazakhCorner position="br" className="bottom-2 right-2" size={30} />

            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#3d0b17] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-inner group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]/80 font-medium">КҮНІ</p>
            <h3 className="mt-2 text-2xl font-serif font-bold text-[#fef08a]">23 ҚАРАША</h3>
            <p className="mt-1 text-sm text-[#e0cfc2]">2026 жыл</p>
            <p className="text-xs text-[#d4af37]/70 mt-2 font-light">Дүйсенбі күні</p>
          </div>

          {/* Card 2: ӨТЕТІН ОРНЫ */}
          <div className="relative wine-card rounded-2xl p-6 sm:p-8 text-center border border-[#d4af37]/35 shadow-lg group hover:border-[#d4af37] transition-all duration-300">
            <KazakhCorner position="tl" className="top-2 left-2" size={30} />
            <KazakhCorner position="br" className="bottom-2 right-2" size={30} />

            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#3d0b17] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-inner group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]/80 font-medium">ӨТЕТІН ОРНЫ</p>
            <h3 className="mt-2 text-2xl font-serif font-bold text-[#fef08a]">«Ақсезім»</h3>
            <p className="mt-1 text-sm text-[#e0cfc2]">мейрамханасы</p>
            <p className="text-xs text-[#d4af37]/70 mt-2 font-light">Салтанат сарайы</p>
          </div>

          {/* Card 3: БАСТАЛУ УАҚЫТЫ */}
          <div className="relative wine-card rounded-2xl p-6 sm:p-8 text-center border border-[#d4af37]/35 shadow-lg group hover:border-[#d4af37] transition-all duration-300">
            <KazakhCorner position="tl" className="top-2 left-2" size={30} />
            <KazakhCorner position="br" className="bottom-2 right-2" size={30} />

            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#3d0b17] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-inner group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-[#d4af37]/80 font-medium">БАСТАЛУ УАҚЫТЫ</p>
            <h3 className="mt-2 text-2xl font-serif font-bold text-[#fef08a]">
              {settings.startTime || "19:00"}
            </h3>
            <p className="text-xs text-[#d4af37]/80 mt-2 font-light">Сағат 19:00-де қонақтардың жиналуы</p>
          </div>
        </div>

        {/* Dress code & Atmosphere badge */}
        <div className="mt-8 p-5 rounded-2xl wine-glass border border-[#d4af37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#360914] text-[#d4af37] border border-[#d4af37]/30">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-[#fef08a] font-serif text-lg font-medium">Дресс-код: Салтанатты кешкі киім</h4>
              <p className="text-xs sm:text-sm text-[#ded0c3]">
                Алтын, шампань, классикалық қою қызыл және салтанатты түстер құпталады.
              </p>
            </div>
          </div>

          <button
            onClick={handleAddToCalendar}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#2a0912] hover:bg-[#3d0b17] text-[#d4af37] text-xs font-medium border border-[#d4af37]/40 hover:border-[#d4af37] transition-colors"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Күнтізбеге сақтау</span>
          </button>
        </div>

        {/* Location & Map Action Button */}
        <div className="mt-8 text-center">
          <a
            href={settings.mapUrl || "https://go.2gis.com/x9mOa"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#87172f] to-[#aa1c3b] hover:brightness-110 text-[#fff7d1] font-medium border border-[#d4af37]/50 shadow-[0_4px_20px_rgba(135,23,47,0.4)] transition-all duration-300 hover:scale-[1.02]"
          >
            <MapPin className="w-4 h-4 text-[#fef08a]" />
            <span>МЕКЕНЖАЙДЫ КӨРУ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
          <p className="text-xs text-[#d4af37]/75 mt-2">
            «Ақсезім» мейрамханасының мекенжайын 2GIS картасынан көру
          </p>
        </div>
      </div>
    </section>
  );
};
