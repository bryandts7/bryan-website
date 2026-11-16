import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { DEMOS } from "./demos";
import Mermaid from "./Mermaid";
import "katex/dist/katex.min.css";

/**
 * Renders admin-written Markdown: GitHub tables/lists, KaTeX math, raw HTML,
 * ```mermaid diagrams and ```demo interactive demos (see components/demos).
 * Only use it for content the site owner wrote (raw HTML is allowed), never
 * for visitor comments.
 */
export default function MarkdownContent({ children }: { children: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        // ```mermaid fences become diagrams and ```demo fences become interactive
        // demos; every other code block stays a <pre>.
        pre({ node, children, ...props }) {
          const code = node?.children[0];
          if (code?.type === "element" && code.tagName === "code" && Array.isArray(code.properties.className)) {
            const text = code.children.map((child) => (child.type === "text" ? child.value : "")).join("");
            if (code.properties.className.includes("language-mermaid")) {
              return <Mermaid chart={text} />;
            }
            if (code.properties.className.includes("language-demo")) {
              const Demo = DEMOS[text.trim()];
              if (Demo) return <Demo />;
            }
          }
          return <pre {...props}>{children}</pre>;
        },
      }}
    >
      {children}
    </Markdown>
  );
}
