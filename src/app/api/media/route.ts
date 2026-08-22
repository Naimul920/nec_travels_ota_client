import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined in environment variables");
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (
    !path ||
    path.includes("\\") ||
    path.split("/").includes("..") ||
    /[\u0000-\u001F\u007F]/.test(path)
  ) {
    return new NextResponse("Invalid path", { status: 400 });
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const target =
    path.startsWith("/api/v1/uploads/") || path.startsWith("/api/v1/")
      ? path
      : `/api/v1/uploads/files/${path}`;

  const response = await fetch(`${API_BASE_URL}${target}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });

  if (!response.ok) {
    return new NextResponse("Not found", { status: response.status });
  }

  const blob = await response.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
