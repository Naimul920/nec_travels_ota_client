"use client";

import { NotFound } from "@/components/ui";

export default function NotFoundPage() {
  return (
    <NotFound
      statusCode={404}
      title="Page Not Found"
      description="Sorry, the page you are looking for does not exist."
      showBack
      showHome
    />
  );
}
