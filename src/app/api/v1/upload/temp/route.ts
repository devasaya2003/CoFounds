import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../../../prisma/supabase_client";
import { BUCKETS } from "../../../../../../prisma/seed";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const certificateId = formData.get('certificateId') as string;
    
    if (!file || !userId) {
      return NextResponse.json({ error: "Missing file or user ID" }, { status: 400 });
    }

    // Create buffer from file
    const buffer = await file.arrayBuffer();
    
    // Create a temp path with certificate ID to track it
    const filePath = `${userId}/temp/${certificateId}_${file.name}`;
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(BUCKETS.COF)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });
      
    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKETS.COF)
      .getPublicUrl(filePath);
      
    return NextResponse.json({ 
      success: true, 
      fileUrl: publicUrl,
      fileId: filePath,
      isTemp: true
    });
    
  } catch (error) {
    console.error("Error in temp upload:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}