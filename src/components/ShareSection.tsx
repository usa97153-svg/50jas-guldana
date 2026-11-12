import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';
import { KazakhCorner, KazakhDivider } from './KazakhOrnament.tsx';

interface ShareSectionProps {
  motherName: string;
}

export const ShareSection: React.FC<ShareSectionProps> = ({ motherName }) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const shareText = `Қадірлі ағайын-туыс! Сіздерді асыл анамыз Гүлдананың 50 жас мерейтойына арналған салтанатты мерекелік ақ дастарханымыздың қадірлі қонағы болуға шақырамыз!\n\nКүні: 23 қараша 2026 жыл\nУақыты: 19:00\nӨтетін орны: «Ақсезім» мейрамханасы\nТойға қатысуды растау және толық ақпарат:`;

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
      } else {
        const input = document.createElement('textarea');
        input.value = `${shareText}\n${url}`;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Ignore
    }
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const fullMessage = `${shareText}\n${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, '_blank');
  };

  const handleTelegramShare = () => {
    const url = getShareUrl();
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
    window.open(tgUrl, '_blank');
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Анамыздың 50 Жас Мерейтойына Шақыру',
          text: shareText,
          url: url
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <section className="relative py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative wine-card rounded-3xl p-6 sm:p-10 text-center border border-[#d4af37]/35 shadow-xl">
          <KazakhCorner position="tl" className="top-2.5 left-2.5" size={32} />
          <KazakhCorner position="tr" className="top-2.5 right-2.5" size={32} />
          <KazakhCorner position="bl" className="bottom-2.5 left-2.5" size={32} />
          <KazakhCorner position="br" className="bottom-2.5 right-2.5" size={32} />

          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#3d0b17] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Share2 className="w-6 h-6" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif text-[#fef08a] gold-text-gradient font-bold">
            Шақыруды Бөлісу
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-[#faebd7]/85 max-w-md mx-auto">
            Осы салтанатты цифрлық шақыруды туған-туыстарыңызға, құдалар мен жақын достарыңызға жіберіңіз
          </p>

          <KazakhDivider className="my-3 max-w-xs mx-auto" />

          {/* Share Buttons Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#128c7e] hover:bg-[#075e54] text-white font-medium text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp арқылы жіберу</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegramShare}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-medium text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>Telegram арқылы жіберу</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#340913] hover:bg-[#460c1a] text-[#fef08a] border border-[#d4af37]/50 font-medium text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-105"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#4ade80]" />
                  <span className="text-[#4ade80]">Сілтеме көшірілді!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#d4af37]" />
                  <span>Сілтемені көшіру</span>
                </>
              )}
            </button>
          </div>

          {copied && (
            <p className="mt-3 text-xs text-[#4ade80] animate-pulse">
              Шақыру мәтіні мен сілтемесі алмасу буферіне көшірілді!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
