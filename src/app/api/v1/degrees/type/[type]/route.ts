import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getDegreeByType } from "@/backend/functions/degree_master/GET/get_by_type";

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const type = (await params).type

  try {
    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const degree = await getDegreeByType(decodeURIComponent(type));

    if (!degree) {
      return NextResponse.json({ error: `Degree with type "${type}" not found` }, { status: 404 });
    }

    return NextResponse.json(degree, { status: 200 });
  } catch (error) {
    console.error("Error fetching degree by type:", error);
    return NextResponse.json({ error: "Failed to fetch degree" }, { status: 500 });
  }
}