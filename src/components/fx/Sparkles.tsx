const spots = [[8, 20], [22, 70], [40, 12], [62, 82], [78, 30], [90, 64], [50, 50], [15, 88]];

export function Sparkles({ color = "#e9cf98", className = "" }: { color?: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {spots.map(([x, y], i) => (
        <svg key={i} viewBox="0 0 10 10" className="absolute h-2.5 w-2.5" style={{ left: `${x}%`, top: `${y}%`, animation: `twinkle ${2.4 + (i % 4) * 0.7}s ease-in-out ${i * 0.45}s infinite` }}>
          <path d="M5 0L6 4 10 5 6 6 5 10 4 6 0 5 4 4Z" fill={color} />
        </svg>
      ))}
    </div>
  );
}
