import { createRealtime, rawSql } from "@neon/realtime/server";

export type LiveRsvp = { id: string; guest_name: string; attending: boolean; party_size: number; message: string | null; created_at: string };

const dbName = () => new URL(process.env.DATABASE_URL!).pathname.slice(1) || "neondb";

export const realtime = createRealtime({ secret: process.env.NEON_REALTIME_SECRET!, db: dbName() });

// Caller MUST have verified the user owns the wedding before sealing.
export const rsvpQuery = (weddingId: string) =>
  rawSql<LiveRsvp>(
    `SELECT id, guest_name, attending, party_size, message, created_at FROM rsvps WHERE wedding_id = $1::uuid ORDER BY created_at DESC LIMIT 100`,
    [weddingId],
  );
