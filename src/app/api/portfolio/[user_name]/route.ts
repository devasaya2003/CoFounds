/**
 * The file for the portfolio route
 * Here it'll call a function that'll provide the summary of a candidate profile by calling with joins
 * Before this we need to complete candidate on-boarding process so that data flow is initialized to & from the DB
 */

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ user_name: string }> }
) {
  const userName = (await params).user_name;
  return NextResponse.json({
    message: "Work in progress... Stay tuned!",
    user: userName,
    status: "pending"
  });
}