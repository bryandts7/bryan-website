// Visitor comments are plain text: no Markdown, no HTML. Only bare links
// (http/https) become clickable, marked as user-generated so search engines
// don't count them as the site's own recommendations.

const URL_PATTERN = /(https?:\/\/[^\s<>"']*[^\s<>"'.,;:!?)\]])/g;

export default function CommentBody({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN);

  return (
    <p className="whitespace-pre-line break-words text-gray-800">
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="nofollow ugc noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </p>
  );
}
