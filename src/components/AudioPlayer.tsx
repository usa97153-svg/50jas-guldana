import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Play, Sparkles } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exact path to user's uploaded "Aday" kyui audio file
  const AUDIO_SRC = '/assets/aistudio/____________46df1f98.mp3';

  // Attempt autoplay immediately on load
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.85;

    // Check if user manually paused previously in this session
    const isUserMuted = sessionStorage.getItem('user_muted') === 'true';
    if (isUserMuted) {
      setIsPlaying(false);
      setIsAutoplayBlocked(false);
      return;
    }

    // Attempt to play immediately
    const startPromise = audio.play();

    if (startPromise !== undefined) {
      startPromise
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch(() => {
          // Autoplay blocked by browser policy (common on mobile browsers)
          setIsPlaying(false);
          setIsAutoplayBlocked(true);

          // Retry on first user interaction anywhere on the document
          const handleFirstInteraction = () => {
            const userMutedNow = sessionStorage.getItem('user_muted') === 'true';
            if (audioRef.current && !userMutedNow && audioRef.current.paused) {
              audioRef.current
                .play()
                .then(() => {
                  setIsPlaying(true);
                  setIsAutoplayBlocked(false);
                })
                .catch(() => {});
            }
            cleanup();
          };

          const cleanup = () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
            window.removeEventListener('pointerdown', handleFirstInteraction);
          };

          window.addEventListener('click', handleFirstInteraction, { once: true });
          window.addEventListener('touchstart', handleFirstInteraction, { once: true });
          window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
        });
    }

    return () => {
      // Keep playing during page lifecycle
    };
  }, []);

  // Explicit start button click
  const handleExplicitPlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    sessionStorage.removeItem('user_muted');
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
      })
      .catch((err) => {
        console.error('Play error:', err);
      });
  };

  // Toggle button (Play / Pause, preserving timestamp)
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      sessionStorage.setItem('user_muted', 'true');
    } else {
      sessionStorage.removeItem('user_muted');
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
        })
        .catch((err) => {
          console.error('Resume error:', err);
        });
    }
  };

  return (
    <>
      {/* Single persistent audio element with fallback source */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src={AUDIO_SRC} type="audio/mpeg" />
        <source src="/aday_kui.mp3" type="audio/mpeg" />
      </audio>

      {/* Prominent floating prompt when autoplay is blocked by browser */}
      {isAutoplayBlocked && !isPlaying && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] sm:w-auto animate-in fade-in slide-in-from-top-3 duration-500">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#3e0b18] via-[#591427] to-[#3e0b18] border-2 border-[#d4af37] shadow-[0_4px_30px_rgba(212,175,55,0.5)] text-[#fef08a]">
            <div className="flex items-center gap-2 text-xs">
              <Music className="w-4 h-4 text-[#fef08a] animate-bounce shrink-0" />
              <span className="font-serif font-medium truncate">
                Құрманғазы — «Адай» күйі
              </span>
            </div>

            <button
              onClick={handleExplicitPlay}
              className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#fef08a] to-[#d4af37] text-[#1c080d] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>ӘУЕНДІ ҚОСУ</span>
            </button>
          </div>
        </div>
      )}

      {/* Permanently available floating sound control button in bottom-right corner */}
      <div className="fixed bottom-6 right-5 z-40 flex items-center gap-2">
        {/* Track label on larger screens */}
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs bg-[#24080f]/95 text-[#fef08a] border border-[#d4af37]/45 shadow-xl backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="font-serif font-medium">
            {isPlaying ? 'Құрманғазы — «Адай» күйі' : 'Құрманғазы — «Адай» күйі'}
          </span>
        </div>

        {/* Toggle Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Әуенді тоқтату" : "Әуенді қосу"}
          className={`group relative flex items-center justify-center p-3.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl ${
            isPlaying
              ? 'bg-[#4e101f] text-[#fef08a] border-2 border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.55)] scale-105'
              : 'bg-[#22070e]/95 text-[#d4af37] border-2 border-[#d4af37]/60 hover:border-[#d4af37] hover:scale-105'
          }`}
          title={isPlaying ? "Әуенді тоқтату" : "Әуенді қосу"}
        >
          {isPlaying ? (
            <div className="flex items-center gap-1">
              <Volume2 className="w-5 h-5 text-[#fdf3a9] animate-pulse" />
              {/* Energetic Equalizer waves */}
              <div className="flex items-end gap-0.5 h-4 ml-1">
                <span className="w-0.5 bg-[#d4af37] rounded-full animate-[bounce_0.4s_infinite] h-3.5" />
                <span className="w-0.5 bg-[#fef08a] rounded-full animate-[bounce_0.35s_infinite] h-4" />
                <span className="w-0.5 bg-[#d4af37] rounded-full animate-[bounce_0.45s_infinite] h-2.5" />
                <span className="w-0.5 bg-[#fef08a] rounded-full animate-[bounce_0.3s_infinite] h-3" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-1">
              <VolumeX className="w-5 h-5 text-[#f87171]" />
              <span className="text-xs font-bold text-[#fef08a]">Әуенді қосу</span>
            </div>
          )}
        </button>
      </div>
    </>
  );
};
