"use client";
import { useEffect, useRef, useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import { SECTIONS, type SectionId } from "@/lib/templates";

// Touch-friendly drag-to-reorder list (motion Reorder). Commits once, when the drag ends.
export function SectionList({ order, hidden, onChange }: { order: SectionId[]; hidden: SectionId[]; onChange: (order: SectionId[], hidden: SectionId[]) => void }) {
  const [items, setItems] = useState(order);
  const dragging = useRef(false);
  useEffect(() => { if (!dragging.current) setItems(order); }, [order]);
  const commit = () => { dragging.current = false; if (items.join() !== order.join()) onChange(items, hidden); };
  return (
    <Reorder.Group axis="y" values={items} onReorder={(v) => { dragging.current = true; setItems(v); }} className="space-y-1">
      {items.map((s) => (
        <Row key={s} id={s} off={hidden.includes(s)} onDragEnd={commit} onToggle={() => onChange(items, hidden.includes(s) ? hidden.filter((x) => x !== s) : [...hidden, s])} />
      ))}
    </Reorder.Group>
  );
}

function Row({ id, off, onDragEnd, onToggle }: { id: SectionId; off: boolean; onDragEnd: () => void; onToggle: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={id} dragListener={false} dragControls={controls} onDragEnd={onDragEnd} whileDrag={{ scale: 1.03, boxShadow: "0 18px 40px -18px rgba(74,20,36,.45)" }}
      className={`flex select-none items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-sm ${off ? "opacity-50" : ""}`}>
      <span onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none px-1 text-lg leading-none text-muted active:cursor-grabbing" aria-label="Drag to reorder">⠿</span>
      <span className="flex-1">{SECTIONS[id]}</span>
      <button onClick={onToggle} className="w-14 rounded-full px-2 text-[12px] text-rose">{off ? "Show" : "Hide"}</button>
    </Reorder.Item>
  );
}
