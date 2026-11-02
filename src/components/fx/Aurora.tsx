export function Aurora({ colors = ["#f3c9cf", "#f6dfc4", "#e7c3dc", "#fbe7dc"] }: { colors?: string[] }) {
  const spots = [
    { top: "-10%", left: "-5%", size: "55vmax", delay: "0s" },
    { top: "40%", left: "55%", size: "50vmax", delay: "-6s" },
    { top: "60%", left: "-10%", size: "45vmax", delay: "-12s" },
    { top: "-20%", left: "60%", size: "40vmax", delay: "-18s" },
  ];
  return (
    <div aria-hidden className="aurora">
      {spots.map((s, i) => (
        <span key={i} style={{ top: s.top, left: s.left, width: s.size, height: s.size, background: colors[i % colors.length], animationDelay: s.delay }} />
      ))}
    </div>
  );
}
