import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../../../prisma/supabase_client";
import { BUCKETS, PATHS } from "../../../../../../prisma/seed";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, files } = data;

    if (!userId || !files || !Array.isArray(files)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const results = await Promise.all(files.map(async (file) => {
      const { tempFileId, certificateId } = file;

      const originalFilename = tempFileId.split('/').pop() || '';
      const fileExtension = originalFilename.includes('.')
        ? '.' + originalFilename.split('.').pop()
        : '';

      const uniqueFilename = `${certificateId}_${uuidv4()}${fileExtension}`;

      const certificatesFolder = PATHS.CERTIFICATES_FOLDER.replace(/^\/+|\/+$/g, '');

      const permanentPath = `${userId}/${certificatesFolder}/${uniqueFilename}`;

      const { data, error } = await supabase.storage
        .from(BUCKETS.COF)
        .move(tempFileId, permanentPath);

      if (error) {
        console.error("Error moving file:", error);
        return { success: false, error: error.message, fileId: tempFileId };
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKETS.COF)
        .getPublicUrl(permanentPath);

      return {
        success: true,
        originalId: tempFileId,
        newId: permanentPath,
        publicUrl, certificateId
      };
    }));

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error("Error finalizing uploads:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}