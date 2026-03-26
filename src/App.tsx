import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-sys selection:bg-[#ff00ff] selection:text-black overflow-hidden relative flex flex-col items-center p-4">
      {/* Glitch overlays */}
      <div className="scanlines" />
      <div className="noise" />

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto py-8 flex flex-col md:flex-row items-start md:items-center justify-between z-10 border-b-4 border-[#ff00ff] mb-8 tear">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-pixel glitch uppercase mb-2 text-white" data-text="SYS.OP.PROTOCOL">
            SYS.OP.PROTOCOL
          </h1>
          <div className="text-xl font-sys text-[#ff00ff] uppercase tracking-widest bg-[#00ffff] text-black inline-block px-2">
            WARNING: UNAUTHORIZED ACCESS DETECTED
          </div>
        </div>
        <div className="text-lg font-sys text-[#00ffff] uppercase tracking-widest mt-4 md:mt-0 text-right">
          <p>ID: 0x8F9A</p>
          <p className="animate-pulse text-[#ff00ff]">STATUS: COMPROMISED</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-12 z-10 pb-20">
        
        {/* Game Area */}
        <div className="flex-1 w-full flex justify-center items-center tear" style={{ animationDelay: '0.5s' }}>
          <div className="w-full max-w-lg jarring-border bg-black p-4">
            <div className="border-b-2 border-[#00ffff] mb-4 pb-2 flex justify-between items-center">
              <span className="font-pixel text-sm text-[#ff00ff]">EXEC: SNAKE.EXE</span>
              <span className="font-sys text-xl animate-pulse">_</span>
            </div>
            <SnakeGame />
          </div>
        </div>

        {/* Sidebar / Music Player */}
        <div className="w-full lg:w-96 flex flex-col gap-8 tear" style={{ animationDelay: '1.2s' }}>
          <div className="jarring-border-alt bg-black p-4">
            <div className="border-b-2 border-[#ff00ff] mb-4 pb-2 flex justify-between items-center">
              <span className="font-pixel text-sm text-[#00ffff]">MOD: AUDIO_STREAM</span>
              <span className="font-sys text-xl animate-pulse">_</span>
            </div>
            <MusicPlayer />
          </div>
          
          <div className="border-4 border-[#00ffff] bg-black p-4 text-xl font-sys">
            <h2 className="text-[#ff00ff] uppercase border-b-2 border-[#ff00ff] mb-2 font-pixel text-xs py-2">DIAGNOSTICS</h2>
            <div className="space-y-1 mt-4">
              <p>&gt; MEMORY: <span className="text-[#00ffff]">CORRUPTED</span></p>
              <p>&gt; UPLINK: <span className="text-[#ff00ff] animate-pulse">UNSTABLE</span></p>
              <p>&gt; OVERRIDE: <span className="text-[#00ffff]">ENGAGED</span></p>
              <p>&gt; KERNEL: <span className="text-[#ff00ff]">PANIC</span></p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
