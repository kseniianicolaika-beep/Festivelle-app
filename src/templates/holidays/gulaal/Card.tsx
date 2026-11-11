"use client";
import type { CardProps } from "../../types";
import { HolidayCard } from "../_shared/HolidayCard";
import { GL_SKIN } from "./Site";
import { Thali, Cloud, HOLI } from "./art";

const Art = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Thali className={className} style={style} />;

export default function Card(props: CardProps) {
  return (
    <HolidayCard
      skin={GL_SKIN}
      props={props}
      Art={Art}
      still="gl-still"
      grain={0.05}
      artScale={1.15}
      backdrop={
        <>
          <Cloud color={HOLI.pink} seed={2} className="pointer-events-none absolute -left-[16cqw] -top-[14cqw] w-[56cqw] opacity-80" />
          <Cloud color={HOLI.yellow} seed={5} className="pointer-events-none absolute -right-[18cqw] -top-[8cqw] w-[50cqw] opacity-80" />
          <Cloud color={HOLI.green} seed={7} className="pointer-events-none absolute -bottom-[16cqw] -left-[14cqw] w-[48cqw] opacity-75" />
          <Cloud color={HOLI.blue} seed={9} className="pointer-events-none absolute -bottom-[16cqw] -right-[16cqw] w-[52cqw] opacity-75" />
        </>
      }
    />
  );
}
