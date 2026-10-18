'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function WhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WA_HELPDESK || '6281234567890';
  const defaultText = encodeURIComponent(
    'Halo Petugas PTSP MAN Insan Cendekia Gowa, saya ingin bertanya seputar layanan permohonan.'
  );
  const waUrl = `https://wa.me/${phone}?text=${defaultText}`;

  // Position state: null initially until mounted to prevent hydration mismatch
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlyingIn, setIsFlyingIn] = useState(true);

  // References for drag calculation
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const hasMovedRef = useRef<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Set default initial position at bottom-right on mount
  useEffect(() => {
    const updateDefaultPosition = () => {
      const btnSize = 64;
      const margin = 16;
      const x = Math.max(12, window.innerWidth - btnSize - margin);
      const y = Math.max(80, window.innerHeight - btnSize - margin - 20);

      setPosition((prev) => {
        if (!prev) return { x, y };
        // Reclamp existing position if window resized
        return {
          x: Math.min(Math.max(12, prev.x), window.innerWidth - btnSize - 12),
          y: Math.min(Math.max(70, prev.y), window.innerHeight - btnSize - 12),
        };
      });
    };

    updateDefaultPosition();
    const flightTimer = window.setTimeout(() => setIsFlyingIn(false), 3800);
    window.addEventListener('resize', updateDefaultPosition);
    return () => {
      window.clearTimeout(flightTimer);
      window.removeEventListener('resize', updateDefaultPosition);
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    // Only respond to primary mouse button or touch
    if (e.button !== 0) return;

    const btn = buttonRef.current;
    if (btn) {
      btn.setPointerCapture(e.pointerId);
    }

    hasMovedRef.current = false;
    setIsDragging(true);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position?.x ?? (window.innerWidth - 68),
      initialY: position?.y ?? (window.innerHeight - 84),
    };
  }, [position]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    const dist = Math.hypot(deltaX, deltaY);

    if (dist > 5) {
      hasMovedRef.current = true;
    }

    const btnSize = 52;
    const padding = 12;
    const minX = padding;
    const maxX = window.innerWidth - btnSize - padding;
    const minY = 64; // Below mobile header
    const maxY = window.innerHeight - btnSize - padding;

    const newX = Math.min(Math.max(minX, dragStartRef.current.initialX + deltaX), maxX);
    const newY = Math.min(Math.max(minY, dragStartRef.current.initialY + deltaY), maxY);

    setPosition({ x: newX, y: newY });
  }, [isDragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    const btn = buttonRef.current;
    if (btn && btn.hasPointerCapture(e.pointerId)) {
      btn.releasePointerCapture(e.pointerId);
    }

    // If it was just a tap / click (movement <= 5px), open WhatsApp
    if (!hasMovedRef.current) {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  }, [isDragging, waUrl]);

  const handlePointerCancel = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    const btn = buttonRef.current;
    if (btn && btn.hasPointerCapture(e.pointerId)) {
      btn.releasePointerCapture(e.pointerId);
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        transform: position
          ? `translate3d(${position.x}px, ${position.y}px, 0)`
          : 'translate3d(calc(100vw - 68px), calc(100vh - 84px), 0)',
        touchAction: 'none',
        visibility: position ? 'visible' : 'hidden',
      }}
      className={`fixed top-0 left-0 z-50 w-16 h-16 bg-transparent text-white flex items-center justify-center select-none ${
        isDragging
          ? 'cursor-grabbing transition-none'
          : 'cursor-grab active:opacity-80 transition-opacity duration-200'
      }`}
      title="Geser untuk memindahkan, ketuk untuk chat Helpdesk WhatsApp"
      aria-label="Hubungi Helpdesk PTSP via WhatsApp"
    >
      <span
        className={`absolute right-full mr-2 whitespace-nowrap rounded-lg bg-[var(--ptsp-primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition-all duration-200 pointer-events-none ${
          isHovered && !isDragging ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'
        }`}
        aria-hidden="true"
      >
        Hubungi kami
      </span>
      <svg
        className={`w-16 h-16 pointer-events-none drop-shadow-[0_2px_3px_rgba(15,23,42,0.65)] ${isFlyingIn && position && !isDragging ? 'animate-owl-arrival' : ''}`}
        viewBox="0 0 100 110"
        fill="none"
        aria-hidden="true"
      >
        {/* Floating full-body owl: ear tufts, facial discs, wings, and talons */}
        <ellipse cx="50" cy="105" rx="16" ry="2.5" fill="#0f172a" fillOpacity="0.22" />
        <g className={isFlyingIn && position && !isDragging ? 'owl-flight-body' : ''} stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
          <path d="M43 80h6v15h-6zm8 0h6v15h-6z" fill="var(--ptsp-primary)" />
          <path d="m43 93-3 4 5-1 2 3 2-5m2 0 2 5 2-3 5 1-3-4" fill="#f4b942" />
          <path d="m43 84-7 5 7 1m14-6 7 5-7 1" fill="var(--ptsp-primary-hover)" />
          <path d="M35 53c-6 2-10 8-10 17v12c0 6 4 10 10 10h30c6 0 10-4 10-10V70c0-9-4-15-10-17" fill="var(--ptsp-primary)" />
          <g className={isFlyingIn && position && !isDragging ? 'owl-wing owl-wing-left owl-wing-flapping' : 'owl-wing owl-wing-left owl-wing-rest'}>
            <path d="M30 61c-6-3-12-3-16 1 3 1 5 3 5 5-4 1-6 4-5 7 4-2 8-1 11 2-1 4 0 7 3 9 4-5 7-8 11-9Z" fill="var(--ptsp-primary)" />
            <path d="m19 66 11 9m-9-1 8 6" fill="none" stroke="white" strokeWidth="1.8" />
          </g>
          <g className={isFlyingIn && position && !isDragging ? 'owl-wing owl-wing-right owl-wing-flapping' : 'owl-wing owl-wing-right owl-wing-rest'}>
            <path d="M70 61c6-3 12-3 16 1-3 1-5 3-5 5 4 1 6 4 5 7-4-2-8-1-11 2 1 4 0 7-3 9-4-5-7-8-11-9Z" fill="var(--ptsp-primary)" />
            <path d="m81 66-11 9m9-1-8 6" fill="none" stroke="white" strokeWidth="1.8" />
          </g>
          <path d="M29 33 27 20l13 8c6-2 14-2 20 0l13-8-2 13c4 5 6 11 6 19 0 16-11 25-27 25S23 68 23 52c0-8 2-14 6-19Z" fill="white" />
          <path d="M29 33 27 20l13 8c3-1 6-1.5 10-1.5V78c-16 0-27-9-27-26 0-8 2-14 6-19Z" fill="var(--ptsp-primary-light)" stroke="none" />
          <path d="M29 51c0-7 5-12 12-12s12 5 12 12-5 13-12 13-12-6-12-13Zm18 0c0-7 5-12 12-12s12 5 12 12-5 13-12 13-12-6-12-13Z" fill="var(--ptsp-primary)" />
          <ellipse className={!isFlyingIn && !isDragging ? 'owl-blink' : ''} cx="41" cy="51" rx="5" ry="5" fill="white" />
          <ellipse className={!isFlyingIn && !isDragging ? 'owl-blink' : ''} cx="59" cy="51" rx="5" ry="5" fill="white" />
          <circle className={!isFlyingIn && !isDragging ? 'owl-blink' : ''} cx="42" cy="51" r="2" fill="#0f172a" stroke="none" />
          <circle className={!isFlyingIn && !isDragging ? 'owl-blink' : ''} cx="58" cy="51" r="2" fill="#0f172a" stroke="none" />
          <path d="m50 55-4 6h8l-4-6Z" fill="#f4b942" />
        </g>
      </svg>
    </button>
  );
}
