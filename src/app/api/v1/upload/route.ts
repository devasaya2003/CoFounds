import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../../prisma/supabase_client";

/**
 * API route to handle file uploads - authentication handled by middleware
 */
export async function POST(req: NextRequest) {
  try {    
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];
        
    console.log("Auth header:", authHeader?.substring(0, 15) + "...");
    
    if (!token) {
      console.log("No token found in request");
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }
        
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const category = formData.get("category") as string || "profile";
    
    console.log("Upload request for userId:", userId, "category:", category);
        
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "No user ID provided" },
        { status: 400 }
      );
    }

    const timestamp = new Date().getTime();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        
    const filePath = `${userId}/${category}/${fileName}`;
        
    const fileBuffer = await file.arrayBuffer();
    
    console.log("Uploading file to path:", filePath);
        
    const { data, error } = await supabase.storage
      .from("COF_BUCKET")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false
      });
    
    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
        
    const { data: { publicUrl } } = supabase.storage
      .from("COF_BUCKET")
      .getPublicUrl(filePath);
    
    console.log("File uploaded successfully, URL:", publicUrl.substring(0, 50) + "...");
    
    return NextResponse.json({
      success: true,
      fileUrl: publicUrl
    });
  } catch (error: unknown) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { success: false, error: error || "Server error" },
      { status: 500 }
    );
  }
}

/**
 * API route to handle file deletion - authentication handled by middleware
 */
export async function DELETE(req: NextRequest) {
  try {    
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split("Bearer ")[1];
    
    if (!token) {
      console.log("No token found in delete request");
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }
        
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get("path");
    
    if (!filePath) {
      return NextResponse.json(
        { success: false, error: "No file path provided" },
        { status: 400 }
      );
    }

    console.log("Deleting file path:", filePath);
            
        
    const { data, error } = await supabase.storage
      .from("COF_BUCKET")
      .remove([filePath]);

    if (error) {
      console.error("Storage deletion error:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("File deleted successfully:", filePath);
    
    return NextResponse.json({
      success: true,
      message: "File deleted successfully"
    });
  } catch (error: unknown) {
    console.error("File deletion error:", error);
    return NextResponse.json(
      { success: false, error: error || "Server error" },
      { status: 500 }
    );
  }
}
