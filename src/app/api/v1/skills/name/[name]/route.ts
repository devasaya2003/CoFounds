import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import { getSkillByName } from "@/backend/functions/skill_master/GET/get_by_name";

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const name = (await params).name

  try {
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const Skill = await getSkillByName(decodeURIComponent(name));

    if (!Skill) {
      return NextResponse.json({ error: `Skill with name "${name}" not found` }, { status: 404 });
    }

    return NextResponse.json(Skill, { status: 200 });
  } catch (error) {
    console.error("Error fetching Skill by name:", error);
    return NextResponse.json({ error: "Failed to fetch Skill" }, { status: 500 });
  }
}