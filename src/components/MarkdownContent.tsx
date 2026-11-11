import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import Mermaid from "./Mermaid";
import "katex/dist/katex.min.css";

/**
 * Renders admin-written Markdown: GitHub tables/lists, KaTeX math, raw HTML
 * and ```mermaid diagrams. Only use it for content the site owner wrote
 * (raw HTML is allowed), never for visitor comments.
 */
export default function MarkdownContent({ children }: { children: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex, rehypeRaw]}
      components={{
        // ```mermaid fences become diagrams; every other code block stays a <pre>.
        pre({ node, children, ...props }) {
          const code = node?.children[0];
          if (
            code?.type === "element" &&
            code.tagName === "code" &&
            Array.isArray(code.properties.className) &&
            code.properties.className.includes("language-mermaid")
          ) {
            const chart = code.children
              .map((child) => (child.type === "text" ? child.value : ""))
              .join("");
            return <Mermaid chart={chart} />;
          }
          return <pre {...props}>{children}</pre>;
        },
      }}
    >
      {children}
    </Markdown>
  );
}
