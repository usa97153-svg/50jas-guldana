import React, { useState } from 'react';
import { Users, Search, Sparkles, HeartHandshake, User } from 'lucide-react';
import { KazakhCorner, KazakhDivider } from './KazakhOrnament.tsx';
import { Guest } from '../types.ts';

interface GuestListSectionProps {
  guests: Guest[];
  totalCount: number;
  loading: boolean;
}

const getSideBadge = (side?: string) => {
  switch (side) {
    case 'mother':
      return { label: 'Анамыздың туыстары', bg: 'bg-[#5c1323]', text: 'text-[#fef08a]' };
    case 'father':
      return { label: 'Әкеміздің туыстары', bg: 'bg-[#421327]', text: 'text-[#fed7aa]' };
    case 'quda':
      return { label: 'Құда-жекжат', bg: 'bg-[#3b1d4a]', text: 'text-[#e9d5ff]' };
    case 'friends':
      return { label: 'Достар мен әріптестер', bg: 'bg-[#1e3a40]', text: 'text-[#a5f3fc]' };
    case 'neighbors':
      return { label: 'Көршілер', bg: 'bg-[#293d25]', text: 'text-[#bbf7d0]' };
    default:
      return { label: 'Қадірлі қонақ', bg: 'bg-[#33111b]', text: 'text-[#fde68a]' };
  }
};

export const GuestListSection: React.FC<GuestListSectionProps> = ({
  guests,
  totalCount,
  loading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.fullName.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesFilter = activeFilter === 'all' || g.side === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section id="guest-list" className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative wine-card rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#d4af37]/40">
          <KazakhCorner position="tl" className="top-3 left-3" size={36} />
          <KazakhCorner position="tr" className="top-3 right-3" size={36} />
          <KazakhCorner position="bl" className="bottom-3 left-3" size={36} />
          <KazakhCorner position="br" className="bottom-3 right-3" size={36} />

          {/* Section Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#3d0b17] border border-[#d4af37]/35 text-[#fef08a] text-xs uppercase tracking-widest mb-3">
              <Users className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>ҚОНАҚТАР ТІЗІМІ</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif text-[#fef08a] gold-text-gradient font-bold">
              Бізбен Бірге Болатын Қонақтар
            </h2>

            <p className="mt-2 text-sm sm:text-base text-[#fef08a]/90 font-serif italic">
              «Сіздердің келетіндеріңізге қуаныштымыз!»
            </p>

            <KazakhDivider className="my-3 max-w-xs mx-auto" />

            {/* Total confirmed count highlight badge */}
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#3e0b18] via-[#541223] to-[#3e0b18] border border-[#d4af37]/50 shadow-md my-2">
              <Sparkles className="w-5 h-5 text-[#fef08a] animate-pulse" />
              <span className="text-sm sm:text-base text-[#fde68a] font-medium">
                Қуанышымызға ортақтасатын қонақтар:
              </span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#fef08a] px-2.5 py-0.5 rounded-lg bg-[#22070e] border border-[#d4af37]/40">
                {totalCount}
              </span>
            </div>
          </div>

          {/* Search bar & Filter */}
          <div className="my-6 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Қонақтың аты-жөні бойынша іздеу..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b060d]/80 border border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none text-sm text-[#fef08a] placeholder-[#947870]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 'all', label: 'Барлығы' },
                { id: 'mother', label: 'Анамыздың туыстары' },
                { id: 'father', label: 'Әкеміздің туыстары' },
                { id: 'quda', label: 'Құдалар' },
                { id: 'friends', label: 'Достар' },
                { id: 'neighbors', label: 'Көршілер' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors border ${
                    activeFilter === tab.id
                      ? 'bg-[#d4af37] text-[#1c080d] font-semibold border-[#fef08a]'
                      : 'bg-[#22070e] text-[#d4af37]/80 border-[#d4af37]/25 hover:border-[#d4af37]/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guests List */}
          {loading ? (
            <div className="py-12 text-center text-[#d4af37]">
              <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">Қонақтар тізімі жүктелуде...</p>
            </div>
          ) : filteredGuests.length === 0 ? (
            <div className="py-10 px-4 text-center rounded-2xl bg-[#1d060d]/60 border border-[#d4af37]/20">
              <HeartHandshake className="w-10 h-10 text-[#d4af37]/60 mx-auto mb-2" />
              <p className="text-sm text-[#fef08a]">
                {searchQuery || activeFilter !== 'all'
                  ? 'Сұранысыңыз бойынша қонақ табылмады'
                  : 'Әзірге тіркелген қонақтар жоқ. Бірінші болып қатысуыңызды растаңыз!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredGuests.map((g, idx) => {
                const badge = getSideBadge(g.side);
                return (
                  <div
                    key={g.id || idx}
                    className="p-4 rounded-2xl bg-[#22070e]/85 border border-[#d4af37]/25 hover:border-[#d4af37]/50 transition-all duration-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#3d0b17] border border-[#d4af37]/40 flex items-center justify-center text-[#fef08a] shrink-0 text-xs font-semibold">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-sm sm:text-base font-semibold text-[#fef08a] leading-tight">
                              {g.fullName}
                            </h4>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          </div>
                        </div>

                        {/* Guest Count Badge */}
                        <div className="shrink-0 px-2.5 py-1 rounded-full bg-[#340913] border border-[#d4af37]/40 text-[#fef08a] text-xs font-medium flex items-center gap-1">
                          <User className="w-3 h-3 text-[#d4af37]" />
                          <span>
                            {g.guestCount === 1 ? '1 адам' : `${g.guestCount} адам`}
                          </span>
                        </div>
                      </div>

                      {/* Optional Wish */}
                      {g.wish && (
                        <div className="mt-2.5 pt-2 border-t border-[#d4af37]/15">
                          <p className="text-xs text-[#faebd7]/80 italic line-clamp-2">
                            «{g.wish}»
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
