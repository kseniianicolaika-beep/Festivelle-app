import type { Bespoke } from "./types";
import { GROUP as A } from "./weddings-a";
import { GROUP as B } from "./weddings-b";
import { GROUP as L } from "./love";
import { GROUP as N } from "./anniv";
import { GROUP as C } from "./celebrate";
import { GROUP as P } from "./play";
import { GROUP as Y } from "./baby";
import { GROUP as G } from "./greet";
import { GROUP as E } from "./events";
import { GROUP as H } from "./holidays";
import { GROUP as Bz } from "./business";
import { GROUP as So } from "./social";

// Bespoke, hand-composed templates by catalog id (see types.ts for the contract).
export const BESPOKE: Record<string, Bespoke> = { ...A, ...B, ...L, ...N, ...C, ...P, ...Y, ...G, ...E, ...H, ...Bz, ...So };
export const bespokeFor = (id?: string | null) => (id ? BESPOKE[id] ?? null : null);
