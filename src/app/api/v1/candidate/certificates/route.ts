import { NextRequest, NextResponse } from "next/server";
import { createBulkCertificates } from "@/backend/functions/user_certificates/POST/create_bulk_certificates";
import { updateUserCertificates } from "@/backend/functions/user_certificates/PUT/update_certificates";
import { CertificateUpdatePayload } from "@/app/(protected-candidate)/candidate/profile/edit/components/certificate/types";

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

export async function PUT(req: NextRequest) {
  try {
    const data: CertificateUpdatePayload = await req.json();
    
    if (!data.user_id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }
    
    const payload = {
      user_id: data.user_id,
      new_certificates: Array.isArray(data.new_certificates) ? data.new_certificates : [],
      updated_certificates: Array.isArray(data.updated_certificates) ? data.updated_certificates : [],
      deleted_certificates: Array.isArray(data.deleted_certificates) ? data.deleted_certificates : []
    };
        
    if (
      payload.new_certificates.length === 0 && 
      payload.updated_certificates.length === 0 && 
      payload.deleted_certificates.length === 0
    ) {
      return NextResponse.json(
        { 
          success: true, 
          message: "No changes to process",
          data: { updated: 0, created: 0, deleted: 0, total: 0 }
        },
        { status: 200 }
      );
    }
    
    if (payload.new_certificates.length > 0) {
      const invalidNewCertificates = payload.new_certificates.filter(cert => !cert.title);
      if (invalidNewCertificates.length > 0) {
        return NextResponse.json(
          { success: false, message: "All new certificates must have a title" },
          { status: 400 }
        );
      }
    }

    if (payload.updated_certificates.length > 0) {
      const invalidUpdatedCertificates = payload.updated_certificates.filter(cert => !cert.id || !cert.title);
      if (invalidUpdatedCertificates.length > 0) {
        return NextResponse.json(
          { success: false, message: "All updated certificates must have an ID and title" },
          { status: 400 }
        );
      }
    }

    const result = await updateUserCertificates(payload);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error updating user certificates:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user certificates",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
