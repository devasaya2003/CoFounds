import { NextRequest, NextResponse } from "next/server";
import { createBulkCertificates } from "@/backend/functions/user_certificates/POST/create_bulk_certificates";
import { CreateBulkCertificatesRequest } from "@/backend/functions/user_certificates/POST/types";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();


    if (!data.user_id || !data.created_by || !data.updated_by) {
      return NextResponse.json(
        { success: false, message: "Missing user_id, created_by, or updated_by fields" },
        { status: 400 }
      );
    }


    if (!data.certificates || !Array.isArray(data.certificates) || data.certificates.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one certificate is required" },
        { status: 400 }
      );
    }


    interface Certificate {
      title: string;
      [key: string]: string | number | boolean | Date | null | undefined;
    }

    const invalidCertificates: Certificate[] = data.certificates.filter((cert: Certificate) => !cert.title);
    if (invalidCertificates.length > 0) {
      return NextResponse.json(
        { success: false, message: "All certificates must have a title" },
        { status: 400 }
      );
    }


    const requestData: CreateBulkCertificatesRequest = {
      user_id: data.user_id,
      created_by: data.created_by,
      updated_by: data.updated_by,
      certificates: data.certificates
    };

    const result = await createBulkCertificates(requestData);


    if (!result.success) {
      return NextResponse.json(
        result,
        { status: 400 }
      );
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
