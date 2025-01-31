import { NextResponse } from "next/server";
import { getCompaniesBySizeRange } from "@/backend/functions/company_master/GET/get_by_size";

export async function GET(
  req: Request,
  { params }: { params: { low: string; high: string } }
) {
  try {
    let low = parseInt(params.low) || 0;
    let high = parseInt(params.high);

    if (isNaN(high) || high < low) {
      return NextResponse.json(
        { error: "Invalid range. 'high' must be greater than or equal to 'low'." },
        { status: 400 }
      );
    }

    const companies = await getCompaniesBySizeRange(low, high);

    return NextResponse.json({ total: companies.length, companies }, { status: 200 });
  } catch (error) {
    console.error("Error fetching companies by size range:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies by size range." },
      { status: 500 }
    );
  }
}
