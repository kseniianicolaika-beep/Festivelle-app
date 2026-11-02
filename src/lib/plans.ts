// Pricing (billing switches on later — shown so couples and agencies know what to expect).
export const COUPLE_PLANS = [
  { id: "free", name: "Draft", inr: "Free", usd: "", points: ["Unlimited AI conversation & designs", "Every template, motif and design world", "Private previews"] },
  { id: "celebration", name: "Celebration", inr: "₹4,999", usd: "$79", note: "one-time, per wedding", points: ["Publish your wedding website", "Email & share invitations, live RSVPs", "All 12 pieces, print-ready downloads", "English · Русский · हिन्दी"] },
  { id: "heritage", name: "Heritage", inr: "₹14,999", usd: "$199", note: "one-time, per wedding", points: ["Your own domain, connected for you", "Priority human concierge", "Family collaborators", "Every future feature included"] },
];

export const AGENCY_PLANS = [
  { id: "atelier", name: "Atelier", inr: "₹7,999", usd: "$99", note: "per month", points: ["3 team seats", "10 active weddings", "Brand kit · “Designed by your agency”", "Client & family view-only access"] },
  { id: "maison", name: "Maison", inr: "₹19,999", usd: "$249", note: "per month", points: ["10 team seats", "Unlimited weddings", "Full white-label (hide our name)", "Custom domains for every client"] },
  { id: "enterprise", name: "Grand Maison", inr: "Let’s talk", usd: "", note: "for planners at scale", points: ["Unlimited seats", "Your own templates library", "Dedicated concierge", "Invoicing in INR / USD / EUR"] },
];
