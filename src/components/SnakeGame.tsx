import React, { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const TILE_COUNT = 20;
const GAME_SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const velocityRef = useRef<Point>({ x: 0, y: 0 });
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  const nextVelocityRef = useRef<Point>({ x: 0, y: 0 });

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    velocityRef.current = { x: 0, y: 0 };
    nextVelocityRef.current = { x: 0, y: 0 };
    foodRef.current = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT),
    };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) {
          resetGame();
        } else {
          setIsPaused((prev) => !prev);
        }
        return;
      }

      const { x, y } = velocityRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextVelocityRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextVelocityRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextVelocityRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextVelocityRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    const gameLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(gameLoop);

      if (time - lastTime < GAME_SPEED) return;
      lastTime = time;

      if (gameOver || isPaused) {
        draw(ctx, canvas.width, canvas.height);
        return;
      }

      update();
      draw(ctx, canvas.width, canvas.height);
    };

    const update = () => {
      velocityRef.current = nextVelocityRef.current;
      const { x: vx, y: vy } = velocityRef.current;

      if (vx === 0 && vy === 0) return;

      const snake = [...snakeRef.current];
      const head = { ...snake[0] };

      head.x += vx;
      head.y += vy;

      if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        setGameOver(true);
        return;
      }

      if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((s) => s + 1);
        let newFood;
        while (true) {
          newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT),
          };
          if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
            break;
          }
        }
        foodRef.current = newFood;
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
    };

    const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Harsh black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const tileW = width / TILE_COUNT;
      const tileH = height / TILE_COUNT;

      // Jarring Grid
      ctx.strokeStyle = '#00ffff';
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      for (let i = 0; i <= TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tileW, 0);
        ctx.lineTo(i * tileW, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * tileH);
        ctx.lineTo(width, i * tileH);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Food (Magenta)
      ctx.fillStyle = '#ff00ff';
      ctx.fillRect(foodRef.current.x * tileW, foodRef.current.y * tileH, tileW, tileH);

      // Snake (Cyan)
      snakeRef.current.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
        ctx.fillRect(segment.x * tileW, segment.y * tileH, tileW - 1, tileH - 1);
      });

      if (gameOver) {
        ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FATAL_ERROR', width / 2, height / 2 - 10);
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#00ffff';
        ctx.fillText('PRESS SPACE TO REBOOT', width / 2, height / 2 + 20);
      } else if (isPaused) {
        ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ff00ff';
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HALTED', width / 2, height / 2);
      }
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="flex justify-between items-center w-full bg-black border-2 border-[#ff00ff] p-2">
        <div className="flex flex-col">
          <span className="text-xs text-[#00ffff] font-pixel">DATA_VOL</span>
          <span className="text-xl font-sys text-[#ff00ff]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-[#00ffff] font-pixel">STATE</span>
          <span className={`text-xl font-sys ${gameOver ? 'text-[#ff00ff] animate-pulse' : isPaused ? 'text-[#ffffff]' : 'text-[#00ffff]'}`}>
            {gameOver ? 'ERR' : isPaused ? 'IDLE' : 'RUN'}
          </span>
        </div>
      </div>

      <div className="relative border-4 border-[#00ffff] bg-black p-1 w-full">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block w-full h-auto max-w-[400px] aspect-square image-rendering-pixelated mx-auto"
        />
      </div>
      
      <div className="text-sm text-[#ff00ff] font-sys text-center uppercase">
        <p>&gt; INPUT: [W,A,S,D] OR [ARROWS]</p>
        <p>&gt; INTERRUPT: [SPACE]</p>
      </div>
    </div>
  );
}
