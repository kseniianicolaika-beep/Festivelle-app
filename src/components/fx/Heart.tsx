export function Heart({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" fill={color} />
    </svg>
  );
}
