import React, { useState, useEffect, useCallback } from 'react';
import { HeroSection } from './components/HeroSection.tsx';
import { InvitationLetter } from './components/InvitationLetter.tsx';
import { EventDetails } from './components/EventDetails.tsx';
import { Countdown } from './components/Countdown.tsx';
import { RsvpSection } from './components/RsvpSection.tsx';
import { GuestListSection } from './components/GuestListSection.tsx';
import { ShareSection } from './components/ShareSection.tsx';
import { AudioPlayer } from './components/AudioPlayer.tsx';
import { GoldParticles } from './components/GoldParticles.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { SvgGoldGradients, KazakhMedallion, KazakhDivider } from './components/KazakhOrnament.tsx';
import { Guest, EventSettings } from './types.ts';
import { Lock, Heart, Sparkles } from 'lucide-react';

const initialSettings: EventSettings = {
  motherName: "ГҮЛДАНА",
  jubileeAge: 50,
  dateStr: "2026-11-23T19:00:00+05:00",
  displayDate: "23 қараша 2026 жыл",
  venueName: "«Ақсезім» мейрамханасы",
  venueAddress: "«Ақсезім» салтанат сарайы",
  startTime: "19:00",
  mapUrl: "https://go.2gis.com/x9mOa"
};

export default function App() {
  const [settings, setSettings] = useState<EventSettings>(initialSettings);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loadingGuests, setLoadingGuests] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch Event Settings
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/event');
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch {
      // Fallback to initial
    }
  }, []);

  // Fetch Guests List
  const fetchGuests = useCallback(async () => {
    try {
      const res = await fetch('/api/guests', {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const text = await res.text();
        const data = JSON.parse(text);
        if (Array.isArray(data.guests)) {
          setGuests(data.guests);
          setTotalCount(data.totalCount || 0);
          try {
            localStorage.setItem('cached_guests', JSON.stringify(data.guests));
            localStorage.setItem('cached_total_count', String(data.totalCount || 0));
          } catch {}
        }
      }
    } catch (err) {
      console.error('Error fetching guests:', err);
    } finally {
      setLoadingGuests(false);
    }
  }, []);

  useEffect(() => {
    // Load from cache on first render if available
    try {
      const cached = localStorage.getItem('cached_guests');
      const cachedCount = localStorage.getItem('cached_total_count');
      if (cached) {
        setGuests(JSON.parse(cached));
        setTotalCount(Number(cachedCount) || 0);
        setLoadingGuests(false);
      }
    } catch {}

    fetchSettings();
    fetchGuests();

    // Auto-refresh guest list every 4 seconds so all guests sync across devices without reloading
    const interval = setInterval(() => {
      fetchGuests();
    }, 4000);

    return () => clearInterval(interval);
  }, [fetchSettings, fetchGuests]);

  const scrollToInvitation = () => {
    const el = document.getElementById('invitation-text');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToRsvp = () => {
    const el = document.getElementById('rsvp-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#120508] text-[#f7eee4] relative selection:bg-[#d4af37] selection:text-[#1c080d]">
      {/* SVG Global Gradients for Ornaments */}
      <SvgGoldGradients />

      {/* Ambient floating golden particles */}
      <GoldParticles />

      {/* Floating Kazakh Music Player */}
      <AudioPlayer />

      {/* Top Royal Banner */}
      <header className="relative z-20 py-3 px-4 border-b border-[#d4af37]/20 bg-[#19060c]/80 backdrop-blur-md text-center">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KazakhMedallion size={26} />
            <span className="font-serif text-xs sm:text-sm tracking-wider text-[#fef08a] font-semibold">
              50 ЖАС МЕРЕЙТОЙЫ
            </span>
          </div>

          <div className="text-[11px] sm:text-xs text-[#d4af37] tracking-widest uppercase font-medium">
            23 ҚАРАША 2026
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-20">
        {/* 1. Hero Section */}
        <HeroSection
          settings={settings}
          onOpenInvitation={scrollToInvitation}
          onJoinRsvp={scrollToRsvp}
        />

        {/* 2. Invitation Letter & Blessing */}
        <InvitationLetter motherName={settings.motherName} />

        {/* 3. Event Details */}
        <EventDetails settings={settings} />

        {/* 4. Live Countdown Timer */}
        <Countdown />

        {/* 5. RSVP Confirmation Form */}
        <RsvpSection onGuestRegistered={fetchGuests} />

        {/* 6. Confirmed Guests Public List */}
        <GuestListSection
          guests={guests}
          totalCount={totalCount}
          loading={loadingGuests}
        />

        {/* 7. Share Invitation with Family & Friends */}
        <ShareSection motherName={settings.motherName} />
      </main>

      {/* Royal Footer */}
      <footer className="relative z-20 py-12 px-4 border-t border-[#d4af37]/25 bg-[#0f0306] text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <KazakhMedallion size={48} className="mx-auto" />

          <h3 className="font-serif text-xl sm:text-2xl text-[#fef08a] gold-text-gradient">
            Қуанышымызға ортақтасқаныңызға рақмет!
          </h3>

          <p className="text-xs sm:text-sm text-[#faebd7]/75 font-light leading-relaxed">
            «Ақ дастарханымыздың төрінде, аяулы анамыздың мерейтойында баршаңызды асыға күтеміз!»
          </p>

          <KazakhDivider className="my-2 max-w-[200px] mx-auto" />

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#d4af37]/70 gap-2 border-t border-[#d4af37]/15">
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>Балалары мен барша туған-туыстарының ізгі ниетімен</span>
            </div>

            {/* Discrete Organizer Lock Button */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 text-[#d4af37]/60 hover:text-[#fef08a] transition-colors p-1"
              title="Ұйымдастырушы режимі"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Ұйымдастырушы кіруі</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        settings={settings}
        guests={guests}
        totalCount={totalCount}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
        onGuestsReload={fetchGuests}
      />
    </div>
  );
}
