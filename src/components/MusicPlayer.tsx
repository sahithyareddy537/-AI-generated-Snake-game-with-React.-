import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'SECTOR_01',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    title: 'VOID_NOISE',
    artist: 'SYS_ADMIN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    title: 'CORRUPTION',
    artist: 'MALWARE_0x99',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full font-sys text-xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="mb-6 border-2 border-[#00ffff] p-2 bg-black">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#ff00ff]">&gt; TRACK:</span>
          <span className="text-[#00ffff] bg-[#ff00ff]/20 px-1">{currentTrackIndex + 1}/{TRACKS.length}</span>
        </div>
        <h3 className="text-white font-pixel text-sm mb-1 truncate">{currentTrack.title}</h3>
        <p className="text-[#00ffff] text-lg">BY: {currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-[#ff00ff] mb-1">
          <span>T-{formatTime(progress)}</span>
          <span>L-{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-4 bg-black border-2 border-[#00ffff] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#ff00ff]"
          style={{
            background: `linear-gradient(to right, #00ffff ${(progress / (duration || 1)) * 100}%, #000 ${(progress / (duration || 1)) * 100}%)`
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center border-2 border-[#ff00ff] p-2">
          <button onClick={prevTrack} className="hover:bg-[#ff00ff] hover:text-black px-2 transition-none">
            [ &lt;&lt; ]
          </button>
          <button onClick={togglePlay} className="hover:bg-[#00ffff] hover:text-black px-4 font-pixel text-sm transition-none">
            {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
          </button>
          <button onClick={nextTrack} className="hover:bg-[#ff00ff] hover:text-black px-2 transition-none">
            [ &gt;&gt; ]
          </button>
        </div>

        <div className="flex items-center space-x-2 border-2 border-[#00ffff] p-2">
          <span className="text-[#ff00ff]">VOL</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-4 bg-black border border-[#ff00ff] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#00ffff]"
            style={{
              background: `linear-gradient(to right, #ff00ff ${volume * 100}%, #000 ${volume * 100}%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
