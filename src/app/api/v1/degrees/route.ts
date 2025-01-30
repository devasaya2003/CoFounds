import { NextResponse } from "next/server";
import { getAllDegrees } from "@/backend/functions/degree_master/GET/get_all";
import { createDegree } from "@/backend/functions/degree_master/POST/create_degree";

export async function GET() {
    try {
        const degrees = await getAllDegrees();
        return NextResponse.json(degrees, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch degrees" }, { status: 500 });
    }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.name || !data.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdDegree = await createDegree(data);

    return NextResponse.json(
      { message: "Degree created successfully", createdDegree },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating degree:", error);
    return NextResponse.json({ error: "Failed to create degree" }, { status: 500 });
  }
}
