import { NextResponse } from 'next/server';
import { getUserSummary } from '@/backend/functions/user_master/GET/get_user_summary';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: "ID is required"
      }, { status: 400 });
    }
    
    const summaryResult = await getUserSummary(id);
    
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