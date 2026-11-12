import React from 'react';
import { KazakhCorner, KazakhDivider, KazakhMedallion } from './KazakhOrnament.tsx';
import { Heart, Sparkles } from 'lucide-react';

interface InvitationLetterProps {
  motherName: string;
}

export const InvitationLetter: React.FC<InvitationLetterProps> = ({ motherName }) => {
  return (
    <section id="invitation-text" className="relative py-16 sm:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Luxury Parchment/Silk Card */}
        <div className="relative wine-card rounded-3xl p-8 sm:p-14 shadow-2xl border border-[#d4af37]/40 text-center overflow-hidden">
          <KazakhCorner position="tl" className="top-3 left-3" size={40} />
          <KazakhCorner position="tr" className="top-3 right-3" size={40} />
          <KazakhCorner position="bl" className="bottom-3 left-3" size={40} />
          <KazakhCorner position="br" className="bottom-3 right-3" size={40} />

          {/* Icon Badge */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#3d0b17] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-inner">
              <Heart className="w-6 h-6 fill-[#d4af37]/20 text-[#d4af37]" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#fef08a] gold-text-gradient tracking-wide mb-3">
            Салтанатты Ақ Тілек
          </h2>

          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mb-6" />

          {/* Required Warm Address Text */}
          <div className="space-y-6 text-[#faebd7] font-light leading-relaxed text-base sm:text-lg">
            <p className="font-serif italic text-lg sm:text-xl text-[#fef08a] font-normal">
              Қадірлі ағайын-туыс, құда-жекжат, көрші-қолаң, ардақты достар!
            </p>

            <p>
              Сіздерді асыл анамыз <strong className="font-semibold text-[#fef08a]">Гүлдананың 50 жас мерейтойына</strong> арналған қуанышымыздың ортақ куәсі болуға шақырамыз.
            </p>

            <p className="text-[#f1ded0]">
              Ақ тілектеріңізді арнап, қуанышымызды бірге бөліссеңіздер, біз үшін үлкен мәртебе!
            </p>

            {/* Mother's honor poem */}
            <div className="my-8 py-5 px-6 rounded-2xl bg-[#22070e]/80 border border-[#d4af37]/20 relative">
              <Sparkles className="w-4 h-4 text-[#d4af37]/70 absolute top-3 left-3" />
              <Sparkles className="w-4 h-4 text-[#d4af37]/70 absolute bottom-3 right-3" />
              <p className="font-serif italic text-sm sm:text-base text-[#f7dc6f] leading-loose">
                «Ана — өмір шуағы, шаңырақ тірегі,<br />
                Жақсылыққа толған кеңпейіл жүрегі.<br />
                Елудің белесі құтты боп, Гүлдана ана,<br />
                Орындалсын әрқашан ақ ізгі тілегі!»
              </p>
            </div>

            <KazakhDivider className="my-4" />

            {/* Signature without grandchildren */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d4af37]/80">
                ІЗГІ НИЕТПЕН ШАҚЫРУШЫЛАР:
              </p>
              <p className="mt-2 text-lg sm:text-xl font-serif text-[#fef08a] font-medium">
                Балалары, келіндері, күйеубалалары, бауырлары және барша туған-туыстарымыз
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
