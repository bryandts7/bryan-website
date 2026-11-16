/** localStorage key for the visitor's light/dark choice. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before the page paints, so a visitor who chose a theme never
 * sees a flash of the other one. Kept tiny and dependency-free. (A separate
 * file from lib/theme.ts so the server-rendered layout can import it.)
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/**
 * Netlify inserts an HTML comment ("This site is hosted on Netlify…") into
 * <head>. React sees it as a mismatch, gives up hydrating and re-renders the
 * whole document, which wipes the theme and language set by the scripts above
 * (and costs a full client render). Remove that comment before React starts:
 * now, and again once the document is parsed in case it comes later. Only
 * <head> is touched: comments that mention Netlify, and the blank line breaks
 * inserted around them (React renders no blank text in <head>). React's own
 * markers are never touched.
 */
export const HOSTING_COMMENT_CLEANUP_SCRIPT = `(function(){function c(){var h=document.head;if(!h)return;for(var n=h.firstChild;n;){var x=n.nextSibling;if((n.nodeType===8&&/netlify/i.test(n.nodeValue||""))||(n.nodeType===3&&!/\\S/.test(n.nodeValue||"")))h.removeChild(n);n=x}}c();document.addEventListener("DOMContentLoaded",c)})();`;
