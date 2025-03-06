/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

interface BlogProps {
  content: string;
  title: string;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Blog: React.FC<BlogProps> = ({ content, title }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{title}</h1>
      <div className="prose prose-lg">
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-outside ml-6 my-4" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-outside ml-6 my-4" {...props} />
            ),
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            p: ({ node, ...props }) => <p className="mb-4" {...props} />,
            a: ({ node, ...props }) => (
              <a className="text-blue-600 hover:underline" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-gray-300 pl-4 italic my-4"
                {...props}
              />
            ),
            code: ({ node, inline, className, children, ...props }: CodeProps) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <pre className="bg-gray-100 rounded p-4 my-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-gray-100 rounded px-1 py-0.5" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Blog;
