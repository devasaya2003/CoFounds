import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../../../prisma/supabase_client";
import { BUCKETS } from "../../../../../../prisma/seed";

export async function POST(req: NextRequest) {
  try {    
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_CLEANUP_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
        
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        
    const { data: tempFiles, error } = await supabase.storage
      .from(BUCKETS.COF)
      .list('', {
        limit: 1000,
        offset: 0,
        sortBy: { column: 'created_at', order: 'asc' }
      });
      
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
        
    const filesToDelete = tempFiles
      .filter(file => file.id.includes('/temp/'))
      .filter(file => new Date(file.created_at) < twentyFourHoursAgo)
      .map(file => file.name);
    
    if (filesToDelete.length === 0) {
      return NextResponse.json({ message: "No files to clean up" });
    }
        
    const { data, error: deleteError } = await supabase.storage
      .from(BUCKETS.COF)
      .remove(filesToDelete);
      
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      cleaned: filesToDelete.length,
      files: filesToDelete
    });
    
  } catch (error) {
    console.error("Error cleaning temporary uploads:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}