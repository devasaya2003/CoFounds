import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getDegreeByName } from "@/backend/functions/degree_master/GET/get_by_name";

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const name = (await params).name

  try {
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const degree = await getDegreeByName(decodeURIComponent(name));

    if (!degree) {
      return NextResponse.json({ error: `Degree with name "${name}" not found` }, { status: 404 });
    }

    return NextResponse.json(degree, { status: 200 });
  } catch (error) {
    console.error("Error fetching degree by name:", error);
    return NextResponse.json({ error: "Failed to fetch degree" }, { status: 500 });
  }
}