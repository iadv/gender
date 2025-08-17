'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

function Balloon({ color, left, delay }: { color: string; left: number; delay: number }) {
  return (
    <div
      className="absolute bottom-0 w-16 h-20 opacity-80 animated-balloon"
      style={{
        left: `${left}%`,
        background: color,
        borderRadius: '9999px',
        animationDelay: `${delay}s`,
      }}
    >
      <div className="w-2 h-8 bg-gray-300 mx-auto mt-20 rounded-full"></div>
    </div>
  );
}

function Car({ color, direction, animate }: { color: string; direction: 'left' | 'right'; animate: boolean }) {
  return (
    <div
      className={`absolute bottom-24 z-20 ${direction === 'left' ? 'left-0' : 'right-0'} w-24 h-12 flex items-center justify-center transition-transform duration-700 ease-in-out`
        + (animate ? ` car-${direction}-move` : '')}
      style={{ pointerEvents: 'none' }}
    >
      <svg width="90" height="40" viewBox="0 0 90 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="15" width="70" height="15" rx="7" fill={color} />
        <rect x="25" y="8" width="40" height="15" rx="7" fill={color} opacity="0.7" />
        <circle cx="25" cy="32" r="6" fill="#222" />
        <circle cx="65" cy="32" r="6" fill="#222" />
      </svg>
    </div>
  );
}

function SmokeCloud({ color, left, size, delay }: { color: string; left: string; size: number; delay: number }) {
  return (
    <div
      className={`absolute animate-smoke-burst`}
      style={{
        background: color,
        left: left,
        top: `${Math.random() * 40}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '9999px',
        opacity: 0.22 + Math.random() * 0.15, // more translucent
        filter: 'blur(14px)',
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function Smoke({ show }: { show: boolean }) {
  // Even more clouds for denser smoke
  const clouds = Array.from({ length: 28 }).map((_, i) => [
    <SmokeCloud key={`pink-${i}`} color="#fbb6ce" left={`${-80 + Math.random() * 80}px`} size={48 + Math.random() * 64} delay={i * 0.18} />,
    <SmokeCloud key={`blue-${i}`} color="#93c5fd" left={`${20 + Math.random() * 80}px`} size={48 + Math.random() * 64} delay={i * 0.18} />
  ]).flat();
  return show ? (
    <div className="absolute left-1/2 z-30" style={{ bottom: 96, transform: `translateX(-50%)`, pointerEvents: 'none', width: '100vw', height: '100vh' }}>
      <div className="relative w-full h-full">
        {clouds}
      </div>
    </div>
  ) : null;
}

export default function Home() {
  const [animateCars, setAnimateCars] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

  // Balloons: alternating pink and blue, random left and delay
  const balloons = Array.from({ length: 10 }).map((_, i) => ({
    color: i % 2 === 0 ? 'linear-gradient(135deg, #fbb6ce 60%, #f472b6 100%)' : 'linear-gradient(135deg, #93c5fd 60%, #38bdf8 100%)',
    left: 10 + Math.random() * 80,
    delay: Math.random() * 5,
  }));

  useEffect(() => {
    let timeout1: NodeJS.Timeout, timeout2: NodeJS.Timeout;
    const startAnimation = () => {
      setAnimateCars(false);
      setShowSmoke(false);
      setTimeout(() => setAnimateCars(true), 500); // Start cars after 0.5s
      setTimeout(() => setShowSmoke(true), 1800); // Show smoke after cars crash
    };
    startAnimation();
    const interval = setInterval(() => {
      startAnimation();
    }, 10000); // Repeat every 10s
    return () => {
      clearInterval(interval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 via-white to-blue-100 overflow-hidden">
      {/* Animated Balloons */}
      <div className="absolute inset-0 pointer-events-none">
        {balloons.map((b, i) => (
          <Balloon key={i} color={b.color} left={b.left} delay={b.delay} />
        ))}
      </div>
      {/* Cars Animation */}
      <Car color="#f472b6" direction="left" animate={animateCars} />
      <Car color="#38bdf8" direction="right" animate={animateCars} />
      {/* Smoke Animation */}
      <Smoke show={showSmoke} />
      {/* Invitation Image */}
      <div className="relative z-10 shadow-2xl rounded-3xl overflow-hidden border-4 border-white max-w-md w-full">
        <Image src="/invite.jpeg" alt="Invitation" width={600} height={900} className="w-full h-auto block" priority />
      </div>
      <style>{`
        .car-left-move {
          transform: translateX(calc(50vw - 120px));
          transition: transform 1.2s cubic-bezier(0.7,1.5,0.7,1.1);
        }
        .car-right-move {
          transform: translateX(calc(-50vw + 120px));
          transition: transform 1.2s cubic-bezier(0.7,1.5,0.7,1.1);
        }
        @keyframes smoke-burst {
          0% { opacity: 0; transform: scale(0.5) translateY(0); }
          40% { opacity: 0.5; transform: scale(1.1) translateY(-20px); }
          100% { opacity: 0; transform: scale(2.2) translateY(-80vh); }
        }
        .animate-smoke-burst {
          animation: smoke-burst 3.2s linear infinite;
        }
      `}</style>
    </div>
  );
}
