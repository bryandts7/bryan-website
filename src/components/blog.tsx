import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import Mermaid from "./Mermaid";
import "katex/dist/katex.min.css";

interface BlogProps {
  content: string;
  title: string;
}

function Blog({ content, title }: BlogProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      <div className="prose prose-lg max-w-none">
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
          {content}
        </Markdown>
      </div>
    </article>
  );
}

export default Blog;
