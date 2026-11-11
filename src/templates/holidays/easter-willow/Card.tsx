"use client";
import type { CardProps } from "../../types";
import { HolidayCard } from "../_shared/HolidayCard";
import { EW_SKIN } from "./Site";
import { Nest, Willow, Blossom } from "./art";

const Art = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Nest className={className} style={style} />;

export default function Card(props: CardProps) {
  const roomy = props.kind !== "table" && props.kind !== "thankyou" && props.kind !== "post";
  return (
    <HolidayCard
      skin={EW_SKIN}
      props={props}
      Art={Art}
      still="ew-still"
      grain={0.06}
      backdrop={
        <>
          <div className="pointer-events-none absolute inset-[3cqw] rounded-[3cqw] border border-[var(--t-gold)]/30" />
          {roomy && <Willow className="pointer-events-none absolute -left-[4cqw] -top-[2cqw] w-[44cqw]" />}
          {roomy && <Willow flip className="pointer-events-none absolute -right-[4cqw] top-[2cqw] w-[36cqw]" />}
          <Blossom className="pointer-events-none absolute bottom-[5cqw] left-[6cqw] w-[9cqw]" />
          <Blossom className="pointer-events-none absolute bottom-[9cqw] right-[7cqw] w-[6cqw]" />
        </>
      }
    />
  );
}
