"use client";

import Link from "next/link";
import { FiLock, FiArrowLeft, FiHome } from "react-icons/fi";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <FiLock className="h-10 w-10 text-amber-600" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-amber-600">
          403 Error
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Access Denied
        </h1>

        <p className="mt-4 text-gray-600">
          You don&apos;t have permission to access this page.
          If you believe this is a mistake, please contact your administrator.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <FiArrowLeft />
            Go Back
          </button>

          <Link
            href="/console"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <FiHome />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
