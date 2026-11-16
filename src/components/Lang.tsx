import type { ReactNode } from "react";
import { formatDate } from "@/lib/dates";
import { MESSAGES, type MessageKey } from "@/lib/i18n";

/*
 * Bilingual output that works in server and client components alike: both
 * languages are rendered, and CSS shows the one the visitor chose (see
 * lib/i18n.ts). No JavaScript is needed to switch.
 */

/**
 * English and Indonesian versions of the same thing. Without an Indonesian
 * version (null, undefined or empty) only the English is rendered.
 * `block` wraps each version in a <div> instead of a <span>.
 */
export function Bi({ en, id, block = false }: { en: ReactNode; id?: ReactNode | null; block?: boolean }) {
  if (id === null || id === undefined || id === "") return <>{en}</>;
  const Tag = block ? "div" : "span";
  return (
    <>
      <Tag className="lang-en">{en}</Tag>
      <Tag className="lang-id" lang="id">
        {id}
      </Tag>
    </>
  );
}

/** A piece of site text from lib/i18n.ts in both languages. */
export function T({ k }: { k: MessageKey }) {
  const en = MESSAGES.en[k];
  const id = MESSAGES.id[k];
  return en === id ? <>{en}</> : <Bi en={en} id={id} />;
}

/** A date in the reader's language: "November 12, 2026" / "12 November 2026". */
export function BiDate({ iso }: { iso: string | null }) {
  if (!iso) return null;
  return (
    <time dateTime={iso}>
      <Bi en={formatDate(iso, "en")} id={formatDate(iso, "id")} />
    </time>
  );
}
