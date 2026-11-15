import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// GitHub-flavored schema, extended with class/id (language hints, heading anchors).
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "id"],
  },
};

/** Sanitized, GFM-enabled README renderer. No DOM required — safe on the server. */
export default function ReadmeMarkdown({ content, components }: { content: string; components?: Components | undefined }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
