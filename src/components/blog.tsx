import MarkdownContent from "./MarkdownContent";

interface BlogProps {
  title: string;
  content: string;
  date?: string | null;
}

function Blog({ title, content, date }: BlogProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {date && <p className="text-sm text-gray-500 mb-6">{date}</p>}
      <div className={`prose prose-lg max-w-none ${date ? "" : "mt-6"}`}>
        <MarkdownContent>{content}</MarkdownContent>
      </div>
    </article>
  );
}

export default Blog;
