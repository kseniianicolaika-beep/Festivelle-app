"use client";
import type { CardProps } from "../../types";
import { HolidayCard } from "../_shared/HolidayCard";
import { DP_SKIN } from "./Site";
import { DiyaTrio, Toran, Kandil } from "./art";

export default function Card(props: CardProps) {
  const { kind } = props;
  const roomy = kind !== "post" && kind !== "table" && kind !== "thankyou";
  return (
    <HolidayCard
      skin={DP_SKIN}
      props={props}
      Art={DiyaTrio}
      still="dp-still"
      backdrop={roomy && (
        <>
          <Toran className="pointer-events-none absolute inset-x-0 top-0 h-[16cqw] w-full" swags={3} />
          <Kandil className="pointer-events-none absolute left-[3cqw] top-[12cqw] w-[9cqw] opacity-90" />
          <Kandil hue="#d43b8c" className="pointer-events-none absolute right-[3cqw] top-[14cqw] w-[8cqw] opacity-90" />
        </>
      )}
    />
  );
}
