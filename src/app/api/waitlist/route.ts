import { NextResponse } from "next/server";
import { createWaitlist } from "@/backend/functions/wait_list_table/POST/create_waitlist";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createWaitlist(data);

    return NextResponse.json(
      { message: "Registered Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating waitlist:", error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message === "This email already exists!") {
      return NextResponse.json(
        { error: "This email already exists!" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create waitlist" },
      { status: 500 }
    );
  }
}
