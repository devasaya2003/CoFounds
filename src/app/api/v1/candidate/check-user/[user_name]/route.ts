import { NextRequest, NextResponse } from "next/server";
import { VALIDATE_USERNAME } from "@/utils/regex_utils/regex_validations";
import { checkUsernameAvailability } from "@/backend/functions/user_master/GET/check_user_name";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ user_name: string }> }
) {
  try {

    console.log("Inside check-user!");

    const userName = (await params).user_name;
    
    const isValidFormat = VALIDATE_USERNAME(userName);
    
    if (!isValidFormat) {
      return NextResponse.json({
        valid: false,
        available: false,
        message: "Username format is invalid. Use only letters, numbers, underscores, and dots (3-30 characters)."
      }, { status: 400 });
    }

    const isAvailable = await checkUsernameAvailability(userName);
    
    return NextResponse.json({
      valid: true,
      available: isAvailable,
      message: isAvailable 
        ? "Username is available!" 
        : "Username is already taken."
    });
    
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({
      valid: false,
      available: false,
      message: "Failed to check username availability."
    }, { status: 500 });
  }
}