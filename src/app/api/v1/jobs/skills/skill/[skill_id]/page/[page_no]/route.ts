import { NextRequest, NextResponse } from "next/server";
import { getAllJobSkillsBySkillIDPaginated } from "@/backend/functions/application_skill_map/GET/get_by_skill_paginated";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ skill_id: string; page_no: string }> }
) {
  const skill_id = (await params).skill_id;
  const page_no = (await params).page_no;

  try {
    const page = parseInt(page_no, 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    const result = await getAllJobSkillsBySkillIDPaginated(skill_id, page);
    if (!result || !result) {
      return NextResponse.json(
        { error: `No skills found for skill id ${skill_id}` },
        { status: 404 }
      );
    }

    if (!result || !result.skills.length) {
      return NextResponse.json(
        { error: `No skills found for page ${page}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching skills by skill id:", err);
    return NextResponse.json(
      { error: "Failed to fetch skills by skill id" },
      { status: 500 }
    );
  }
}
