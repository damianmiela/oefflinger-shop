/**
 * Renders a JSON-LD <script> for structured data (P2-14e/f → §4.5).
 * `<` is escaped to < so product/WP content can never break out of the script.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
