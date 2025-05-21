import { NextRequest, NextResponse } from "next/server";
import { updateUserLinks } from "@/backend/functions/user_links/PUT/update_links";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    console.log("== LINKS UPDATE - REQUEST BODY ==");
    console.log(JSON.stringify(data, null, 2));
    
    // Basic validation
    if (!data.user_id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate that at least one operation is being performed
    if (
      (!data.new_links || data.new_links.length === 0) &&
      (!data.updated_links || data.updated_links.length === 0) &&
      (!data.deleted_links || data.deleted_links.length === 0)
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: "No changes provided. At least one operation (create, update, or delete) must be included" 
        },
        { status: 400 }
      );
    }

    // Validate new links entries
    if (data.new_links && data.new_links.length > 0) {
      for (const link of data.new_links) {
        if (!link.link_url || !link.link_title) {
          return NextResponse.json(
            { 
              success: false, 
              error: "Each new link record must include link_url and link_title" 
            },
            { status: 400 }
          );
        }
      }
    }

    // Validate updated links entries
    if (data.updated_links && data.updated_links.length > 0) {
      for (const link of data.updated_links) {
        if (!link.id || !link.link_url || !link.link_title) {
          return NextResponse.json(
            { 
              success: false, 
              error: "Each updated link record must include id, link_url, and link_title" 
            },
            { status: 400 }
          );
        }
      }
    }

    // Update the links records
    const result = await updateUserLinks(data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to update link records", 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Link records updated successfully",
      data: result.data
    });

  } catch (error) {
    console.error("Error updating link records:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update link records",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}