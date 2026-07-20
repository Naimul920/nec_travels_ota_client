"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-8xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-3xl font-semibold text-gray-900">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-3 transition hover:bg-gray-100"
        >
          Go Back
        </button>

        <Link
          href="/"
          className="rounded-lg bg-primary px-6 py-3 text-white transition hover:opacity-90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}