"use client";
import type { CardProps } from "../../types";
import { HolidayCard } from "../_shared/HolidayCard";
import { MC_SKIN } from "./Site";
import { Coupes, Bloom, Clock } from "./art";

const Toast = ({ className, style, animate }: { className?: string; style?: React.CSSProperties; animate?: boolean }) => <Coupes className={className} style={style} animate={animate} />;
const Face = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Clock midnight className={className} style={style} />;

export default function Card(props: CardProps) {
  const { kind } = props;
  const clocky = kind === "save" || kind === "post" || kind === "story";
  return (
    <HolidayCard
      skin={MC_SKIN}
      props={props}
      Art={clocky ? Face : Toast}
      artScale={clocky ? 0.8 : 1}
      still="mc-still"
      backdrop={
        <>
          <div className="mc-frame pointer-events-none absolute inset-[3cqw]" />
          <Bloom className="mc-bloom pointer-events-none absolute left-[6cqw] top-[6cqw] w-[24cqw] opacity-60" />
          <Bloom color="#ff9f7a" className="mc-bloom pointer-events-none absolute bottom-[10cqw] right-[6cqw] w-[18cqw] opacity-50 [animation-delay:2s]" />
        </>
      }
    />
  );
}
