"use client";

import ReactMarkdown from "react-markdown";

export function MarkdownContent({ md }: { md: string }) {
  return <ReactMarkdown>{md}</ReactMarkdown>;
}
