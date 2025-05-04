import { NextResponse } from 'next/server';
import { getUserSummary } from '@/backend/functions/user_master/GET/get_user_summary';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_name: string }> }
) {
  try {
    const userName = (await params).user_name;
    
    if (!userName) {
      return NextResponse.json({
        success: false,
        error: "Username is required"
      }, { status: 400 });
    }
    
    const summaryResult = await getUserSummary(userName);
    
    if (!summaryResult.success) {
      return NextResponse.json({
        success: false,
        error: summaryResult.error
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: summaryResult.data
    });
    
  } catch (error) {
    console.error("Error in summary API:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch summary"
    }, { status: 500 });
  }
}