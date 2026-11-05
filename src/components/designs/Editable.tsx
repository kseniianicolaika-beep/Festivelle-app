"use client";
import { createContext, useContext, type ElementType, type ReactNode } from "react";

// CONTRACT (shared by layouts + visual editor). Layouts wrap every editable bit in <E>. With no provider
// (published sites, exports, catalog previews) <E> renders plain markup. Inside the studio the editor
// provides EditCtx and <E> becomes click-to-select / inline-editable, writing to a design path like
// "texts.headline", "items.2.title", "profile.partner1", "photo" or "section:gallery".
export type EditCtx = {
  editable: boolean;
  selected?: string | null;
  select: (path: string, kind: "text" | "photo" | "section") => void;
  commit: (path: string, value: string) => void;
};
export const EditContext = createContext<EditCtx | null>(null);
export const useEdit = () => useContext(EditContext);

export function E({ path, as, className, style, children, multiline }: { path: string; as?: ElementType; className?: string; style?: React.CSSProperties; children: ReactNode; multiline?: boolean }) {
  const ctx = useEdit();
  const Tag = (as ?? "span") as ElementType;
  if (!ctx?.editable) return <Tag className={className} style={style}>{children}</Tag>;
  const on = ctx.selected === path;
  return (
    <Tag
      className={`${className ?? ""} cursor-text rounded-sm outline-offset-4 transition-[outline] ${on ? "outline outline-2 outline-[#c06c78]" : "hover:outline hover:outline-1 hover:outline-[#c06c78]/60"}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      data-edit-path={path}
      onFocus={() => ctx.select(path, "text")}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => { if (e.key === "Enter" && !multiline) { e.preventDefault(); e.currentTarget.blur(); } if (e.key === "Escape") e.currentTarget.blur(); }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => { const v = e.currentTarget.innerText.trim(); if (v !== String(children ?? "").trim()) ctx.commit(path, v); }}
    >
      {children}
    </Tag>
  );
}
