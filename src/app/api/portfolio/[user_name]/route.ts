import { NextResponse } from 'next/server';
import { getUserPortfolio } from '@/backend/functions/portfolio/get_user_portfolio';

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
    
    const portfolioResult = await getUserPortfolio(userName);
    
    if (!portfolioResult.success) {
      return NextResponse.json({
        success: false,
        error: portfolioResult.error
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: portfolioResult.data
    });
    
  } catch (error) {
    console.error("Error in portfolio API:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch portfolio"
    }, { status: 500 });
  }
}