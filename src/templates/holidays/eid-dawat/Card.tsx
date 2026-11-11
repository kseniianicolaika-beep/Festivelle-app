"use client";
import type { CardProps } from "../../types";
import { HolidayCard } from "../_shared/HolidayCard";
import { ED_SKIN } from "./Site";
import { LanternMoon, Crescent, Lattice, Mihrab } from "./art";

const Art = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <LanternMoon className={className} style={style} />;

export default function Card(props: CardProps) {
  const roomy = props.kind !== "table" && props.kind !== "thankyou" && props.kind !== "post";
  return (
    <HolidayCard
      skin={ED_SKIN}
      props={props}
      Art={Art}
      still="ed-still"
      grain={0.1}
      artScale={0.95}
      backdrop={
        <>
          {roomy && <Mihrab className="pointer-events-none absolute inset-x-[5cqw] bottom-[3cqw] top-[3cqw] h-[calc(100%-6cqw)] w-[90cqw] opacity-70" />}
          {!roomy && <div className="pointer-events-none absolute inset-[3cqw] border border-[var(--t-gold)]/45" />}
          <Crescent className="pointer-events-none absolute right-[7cqw] top-[6cqw] w-[11cqw]" />
          <Lattice n={9} className="pointer-events-none absolute bottom-[1cqw] left-1/2 w-[70cqw] -translate-x-1/2 opacity-60" />
        </>
      }
    />
  );
}
