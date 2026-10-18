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
      const btnSize = 52;
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
    window.addEventListener('resize', updateDefaultPosition);
    return () => window.removeEventListener('resize', updateDefaultPosition);
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
      style={{
        transform: position
          ? `translate3d(${position.x}px, ${position.y}px, 0)`
          : 'translate3d(calc(100vw - 68px), calc(100vh - 84px), 0)',
        touchAction: 'none',
        visibility: position ? 'visible' : 'hidden',
      }}
      className={`fixed top-0 left-0 z-50 w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 border-2 border-white/80 dark:border-slate-800 select-none ${
        isDragging
          ? 'cursor-grabbing scale-105 shadow-2xl transition-none'
          : 'cursor-grab hover:scale-110 active:scale-95 transition-transform duration-200'
      }`}
      title="Geser untuk memindahkan, ketuk untuk chat Helpdesk WhatsApp"
      aria-label="Hubungi Helpdesk PTSP via WhatsApp"
    >
      <svg
        className="w-7 h-7 fill-current pointer-events-none drop-shadow-xs"
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    </button>
  );
}
