"use client";
import type { CardProps } from "../../types";
import { HolidayCard } from "../_shared/HolidayCard";
import { MF_SKIN } from "./Site";
import { Fir, Holly, Snow } from "./art";

const Tree = ({ className, style, animate }: { className?: string; style?: React.CSSProperties; animate?: boolean }) => <Fir className={className} style={style} animate={animate} />;

export default function Card(props: CardProps) {
  const roomy = props.kind !== "table" && props.kind !== "thankyou";
  return (
    <HolidayCard
      skin={MF_SKIN}
      props={props}
      Art={Tree}
      still="mf-still"
      grain={0.1}
      backdrop={
        <>
          <Snow count={30} fall={props.animate !== false} />
          <div className="pointer-events-none absolute inset-[3cqw] rounded-[2cqw] border border-[var(--t-gold)]/40" />
          {roomy && <Holly className="pointer-events-none absolute left-[4cqw] top-[4cqw] w-[14cqw] -rotate-12" />}
          {roomy && <Holly className="pointer-events-none absolute bottom-[4cqw] right-[4cqw] w-[14cqw] rotate-[168deg]" />}
        </>
      }
    />
  );
}
