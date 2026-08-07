"use client";

import { NotFound } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <NotFound
      statusCode={404}
      title="Page Not Found"
      description="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
      showBack
      showHome
    />
  );
}