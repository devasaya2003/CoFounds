import { NextResponse } from "next/server";
import { getAllSkills } from "@/backend/functions/skill_master/GET/get_all";
import { createSkill } from "@/backend/functions/skill_master/POST/create_skills";

export async function GET() {
  try {
    const skills = await getAllSkills();
    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdSkill = await createSkill(data);

    return NextResponse.json(
      { message: "Skill created successfully", createdSkill },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Skills:", error);
    return NextResponse.json({ error: "Failed to create Skills" }, { status: 500 });
  }
}
