// Neon Auth → Sequenzy: sign-up verification and password-reset codes (see src/lib/auth-email/handler.ts).
import { handleAuthEmail } from "@/lib/auth-email/handler";

export function GET(request: Request) { return handleAuthEmail(request); }
export function POST(request: Request) { return handleAuthEmail(request); }
