import { createBulkWaitlist } from "@/backend/functions/wait_list_table/POST/bulk_create";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const waitlists = await req.json();

    if (!Array.isArray(waitlists) || waitlists.length === 0) {
      return NextResponse.json({ error: "Waitlist must be a non-empty array" }, { status: 400 });
    }

    const createdWaitlist = await createBulkWaitlist(waitlists);

    return NextResponse.json(
      { message: "Waitlist created successfully", createdWaitlist },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating bulk waitlists:", error);
    return NextResponse.json({ error: "Failed to create bulk waitlists" }, { status: 500 });
  }
}