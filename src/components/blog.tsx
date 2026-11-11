import Image from "next/image";
import MarkdownContent from "./MarkdownContent";

interface BlogProps {
  title: string;
  content: string;
  date?: string | null;
  coverImageUrl?: string | null;
}

function Blog({ title, content, date, coverImageUrl }: BlogProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {date && <p className="text-sm text-gray-500 mb-6">{date}</p>}
      {coverImageUrl && (
        <div className="relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={coverImageUrl}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 736px, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className={`prose prose-lg max-w-none ${date || coverImageUrl ? "" : "mt-6"}`}>
        <MarkdownContent>{content}</MarkdownContent>
      </div>
    </article>
  );
}

export default Blog;
