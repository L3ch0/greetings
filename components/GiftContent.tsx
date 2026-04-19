import { Gift } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface GiftContentProps {
  gift: Gift;
  onClose: () => void;
}

export default function GiftContent({ gift, onClose }: GiftContentProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="
          w-full max-h-[85vh] overflow-y-auto
          bg-bg rounded-t-3xl rounded-b-none p-6 pb-safe-bottom
          md:max-w-lg md:rounded-3xl md:max-h-[80vh] md:m-4
        "
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-ink/10 hover:bg-ink/20 transition-colors"
          aria-label="Закрити"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content based on gift type */}
        <div className="mt-8">
          <h2 className="font-heading text-2xl md:text-3xl text-ink mb-6">
            {gift.title}
          </h2>

          {gift.type === 'memory' && (
            <div className="space-y-4">
              <p className="font-body text-base md:text-lg leading-relaxed text-ink whitespace-pre-wrap">
                {gift.content}
              </p>
              {gift.image && (
                <img
                  src={gift.image}
                  alt={gift.title}
                  className="max-h-[50vh] w-full object-cover rounded-2xl"
                />
              )}
            </div>
          )}

          {gift.type === 'compliment' && (
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="font-body text-lg md:text-xl text-center leading-relaxed text-ink">
                "{gift.content}"
              </p>
            </div>
          )}

          {gift.type === 'promise' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  className="text-accent"
                >
                  <path
                    d="M32 8L12 24L32 40L52 24L32 8Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                  <path
                    d="M32 56C42 46 52 36 52 24"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M32 56C22 46 12 36 12 24"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="font-body text-base md:text-lg text-center leading-relaxed text-ink whitespace-pre-wrap">
                {gift.content}
              </p>
            </div>
          )}

          {gift.type === 'photo' && (
            <div className="space-y-4">
              <img
                src={gift.image}
                alt={gift.title}
                className="max-h-[50vh] w-full object-cover rounded-2xl"
              />
              <p className="font-body text-sm md:text-base italic text-center text-ink/80">
                {gift.caption}
              </p>
            </div>
          )}

          {gift.type === 'voice' && (
            <VoicePlayer audioSrc={gift.audio!} />
          )}

          {gift.type === 'quote' && (
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="font-heading text-lg md:text-2xl italic text-center leading-relaxed text-ink whitespace-pre-wrap">
                {gift.content}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function VoicePlayer({ audioSrc }: { audioSrc: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-accent hover:bg-accent/90 transition-colors"
          aria-label={isPlaying ? 'Пауза' : 'Відтворити'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const audio = audioRef.current;
              if (audio) {
                audio.currentTime = Number(e.target.value);
              }
            }}
            className="w-full h-2 bg-ink/20 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(currentTime / duration) * 100}%, rgb(45 27 46 / 0.2) ${(currentTime / duration) * 100}%, rgb(45 27 46 / 0.2) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-ink/60 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
