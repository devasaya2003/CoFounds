import { NextRequest, NextResponse } from "next/server";
import { createBulkCertificates } from "@/backend/functions/user_certificates/POST/create_bulk_certificates";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.user_id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }
    
    const requestData = {
      user_id: data.user_id,
      created_by: data.created_by || data.user_id,
      updated_by: data.updated_by || data.user_id,
      certificates: data.certificates || []
    };

    if (!requestData.certificates || !Array.isArray(requestData.certificates) || requestData.certificates.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one certificate is required" },
        { status: 400 }
      );
    }
    
    const invalidCertificates = requestData.certificates.filter(cert => !cert.title);
    if (invalidCertificates.length > 0) {
      return NextResponse.json(
        { success: false, message: "All certificates must have a title" },
        { status: 400 }
      );
    }

    const result = await createBulkCertificates(requestData);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating user certificates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user certificates",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
