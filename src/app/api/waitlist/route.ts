import { NextResponse } from "next/server";
import { createWaitlist } from "@/backend/functions/wait_list_table/POST/create_waitlist";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.email || !data.phone || !data.preferredRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdWaitlist = await createWaitlist(data);

    return NextResponse.json(
      { message: "Waitlist created successfully", createdWaitlist },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating waitlist:", error);
    return NextResponse.json({ error: "Failed to create waitlist" }, { status: 500 });
  }
}
