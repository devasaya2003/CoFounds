import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../../../prisma/supabase_client";
import { BUCKETS } from "../../../../../../prisma/seed";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { fileId } = data;
    
    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }
    
    // Delete the file
    const { data: deleteData, error } = await supabase.storage
      .from(BUCKETS.COF)
      .remove([fileId]);
      
    if (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      deleted: fileId
    });
    
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}