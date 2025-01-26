import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getResourceByTitle } from "@/backend/functions/resource_master/GET/get_by_title";

export async function GET(req: NextRequest, { params }: { params: Promise<{ title: string }> }) {
  const title = (await params).title

  try {
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const resource = await getResourceByTitle(decodeURIComponent(title));

    if (!resource) {
      return NextResponse.json({ error: `Resource with title "${title}" not found` }, { status: 404 });
    }

    return NextResponse.json(resource, { status: 200 });
  } catch (error) {
    console.error("Error fetching resource by title:", error);
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
  }
}