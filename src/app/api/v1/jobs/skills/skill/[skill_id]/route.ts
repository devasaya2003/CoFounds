import { NextRequest, NextResponse } from "next/server";
import { getAllJobSkillsBySkillID } from "@/backend/functions/application_skill_map/GET/get_by_skill";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ skill_id: string }> }
) {
  const skill_id = (await params).skill_id;

  try {
    const result = await getAllJobSkillsBySkillID(skill_id);
    if (!result || !result) {
      return NextResponse.json(
        { error: `No skills found for skill id ${skill_id}` },
        { status: 404 }
      );
    }
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Error fetching skills by skill id:", err);
    return NextResponse.json(
      { error: "Failed to fetch skills by skill id" },
      { status: 500 }
    );
  }
}
