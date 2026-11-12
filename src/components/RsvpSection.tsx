import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { UserCheck, Users, MessageSquare, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { KazakhCorner, KazakhDivider } from './KazakhOrnament.tsx';
import { Guest } from '../types.ts';

interface RsvpSectionProps {
  onGuestRegistered: () => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ onGuestRegistered }) => {
  const [fullName, setFullName] = useState('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [side, setSide] = useState<string>('mother');
  const [wish, setWish] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Duplicate prompt state
  const [duplicateGuest, setDuplicateGuest] = useState<Guest | null>(null);

  const triggerLuxuryConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#d4af37', '#fdf3a9', '#87172f', '#f7dc6f', '#ffffff']
      });
    } catch {
      // Ignore if canvas-confetti is not available
    }
  };

  const submitRsvp = async (forceUpdate = false) => {
    if (!fullName.trim()) {
      setErrorMsg('Өтінеміз, аты-жөніңізді жазыңыз');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/guests/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          guestCount,
          side,
          wish: wish.trim(),
          forceUpdate
        })
      });

      const rawText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error('Сервермен байланыс орнатылмады. Қайталап көріңіз.');
      }

      if (res.status === 409 && data.status === 'duplicate') {
        // Show duplicate confirmation modal
        setDuplicateGuest(data.existingGuest);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Қате орын алды. Қайталап көріңіз.');
      }

      // Success
      setSuccessMsg(data.message || 'Қош келдіңіз! Сіздің есіміңіз қонақтар тізіміне қосылды!');
      setDuplicateGuest(null);
      triggerLuxuryConfetti();
      onGuestRegistered();

      // Reset form
      setFullName('');
      setWish('');

      // Scroll to guest list smoothly after brief moment so user sees their name
      setTimeout(() => {
        const listEl = document.getElementById('guest-list');
        if (listEl) {
          listEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Желіде қате орын алды. Байланысты тексеріңіз.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpdate = () => {
    submitRsvp(true);
  };

  const handleCancelUpdate = () => {
    setDuplicateGuest(null);
  };

  return (
    <section id="rsvp-section" className="relative py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="relative wine-card rounded-3xl p-6 sm:p-12 shadow-2xl border border-[#d4af37]/45">
          <KazakhCorner position="tl" className="top-3 left-3" size={38} />
          <KazakhCorner position="tr" className="top-3 right-3" size={38} />
          <KazakhCorner position="bl" className="bottom-3 left-3" size={38} />
          <KazakhCorner position="br" className="bottom-3 right-3" size={38} />

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#380b16] border border-[#d4af37]/40 text-[#fef08a] text-xs uppercase tracking-widest mb-3">
              <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>ҚОНАҚТАРДЫ ТІРКЕУ</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif text-[#fef08a] gold-text-gradient font-bold">
              Қатысуыңызды Растаңыз
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-[#faebd7]/85 max-w-md mx-auto">
              Қуанышымызға ортақтасып, мерейтойлық ақ дастарханымыздың қадірлі қонағы болу үшін төмендегі пішінді толтырыңыз
            </p>

            <KazakhDivider className="my-3 max-w-xs mx-auto" />
          </div>

          {/* Success Message Banner */}
          {successMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-[#1d432b]/90 border border-[#4ade80]/60 text-[#dcfce7] flex items-start gap-3 shadow-lg animate-in fade-in">
              <CheckCircle className="w-6 h-6 text-[#4ade80] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm sm:text-base">{successMsg}</p>
                <p className="text-xs text-[#bbf7d0] mt-1">
                  Сіздің есіміңіз төмендегі қонақтар тізіміне сәтті енгізілді. Тойда кездескенше!
                </p>
              </div>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-[#4a121d]/90 border border-[#f87171]/60 text-[#fee2e2] flex items-center gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-[#f87171] shrink-0" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          {/* Duplicate confirmation modal */}
          {duplicateGuest && (
            <div className="mb-6 p-5 rounded-2xl bg-[#341119] border-2 border-[#f59e0b] text-[#fef3c7] shadow-2xl animate-in zoom-in-95">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-[#f59e0b] shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-bold text-base text-[#fef08a]">
                    Бұл есім бұрын тіркелген!
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#fde68a]">
                    «<span className="font-semibold">{duplicateGuest.fullName}</span>» есімімен қонақ (барлығы {duplicateGuest.guestCount} адам) бұған дейін тіркелген. Мәліметтеріңізді жаңартқыңыз келе ме?
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={handleConfirmUpdate}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#eab308] text-[#1c080d] font-semibold text-xs transition-colors"
                    >
                      Иә, жаңарту
                    </button>
                    <button
                      onClick={handleCancelUpdate}
                      className="px-4 py-2 rounded-xl bg-[#22070e] hover:bg-[#2e0913] text-[#fef3c7] border border-[#d4af37]/30 text-xs transition-colors"
                    >
                      Жоқ, басқа есім жазу
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitRsvp(false);
            }}
            className="space-y-5"
          >
            {/* Full Name Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-medium mb-1.5">
                Аты-жөніңіз <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Мысалы: Серік Ахметов"
                className="w-full px-4 py-3 rounded-xl bg-[#1c070d]/80 border border-[#d4af37]/35 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] text-[#fff7ed] placeholder-[#a88a80] text-sm sm:text-base transition-colors"
              />
            </div>

            {/* Guest Count Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-medium mb-1.5">
                Қонақтар саны (өзіңізбен бірге)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                      guestCount === num
                        ? 'bg-[#d4af37] text-[#1a060b] border-[#fef08a] shadow-md scale-105'
                        : 'bg-[#22070e]/80 text-[#fde68a] border-[#d4af37]/30 hover:border-[#d4af37]/70'
                    }`}
                  >
                    {num === 1 ? '1 өзім' : `${num} адам`}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#d4af37]/75 mt-1.5">
                Жұбайыңызбен немесе отбасыңызбен келетін болсаңыз, жалпы санын көрсетіңіз
              </p>
            </div>

            {/* Relationship / Side of Family */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-medium mb-1.5">
                Кімнің жағынан қонақсыз?
              </label>
              <select
                value={side}
                onChange={(e) => setSide(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1c070d]/80 border border-[#d4af37]/35 focus:border-[#d4af37] focus:outline-none text-[#fff7ed] text-sm"
              >
                <option value="mother" className="bg-[#2a0812] text-[#fff]">Анамыздың туыстары (нағашылар)</option>
                <option value="father" className="bg-[#2a0812] text-[#fff]">Әкеміздің туыстары (өз жұртымыз)</option>
                <option value="quda" className="bg-[#2a0812] text-[#fff]">Құда-жекжаттар</option>
                <option value="friends" className="bg-[#2a0812] text-[#fff]">Отбасылық достар мен әріптестер</option>
                <option value="neighbors" className="bg-[#2a0812] text-[#fff]">Көрші-қолаңдар</option>
                <option value="other" className="bg-[#2a0812] text-[#fff]">Қадірлі қонақ</option>
              </select>
            </div>

            {/* Wishes Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#d4af37] font-medium mb-1.5">
                Асыл анамызға ақ тілегіңіз (қалауыңыз бойынша)
              </label>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                rows={2}
                placeholder="Мерейтой иесіне ізгі жүрекжарды тілегіңізді жаза аласыз..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1c070d]/80 border border-[#d4af37]/35 focus:border-[#d4af37] focus:outline-none text-[#fff7ed] placeholder-[#a88a80] text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f7dc6f] to-[#d4af37] text-[#1c080d] font-bold text-sm sm:text-base tracking-wider uppercase shadow-[0_4px_25px_rgba(212,175,55,0.45)] hover:brightness-110 active:scale-[0.99] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#1c080d] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#1c080d]" />
                    <span>ҚАТЫСАТЫНЫМДЫ РАСТАУ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
