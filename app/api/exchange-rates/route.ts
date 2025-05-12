import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db";
import {ExchangeRateData, ExchangeRateResponse} from "@/types/exchange-rate";

export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const searchParams = request.nextUrl.searchParams;

    let firstDateStr = searchParams.get("first_date");
    let secondDateStr = searchParams.get("second_date");

    let firstDate: Date;
    let secondDate: Date;

    if (!secondDateStr) {
      if(!firstDateStr) {
        firstDate = new Date();
      }
      else{
        firstDate = new Date(firstDateStr);
      }

      secondDate = new Date(firstDate);
      secondDate.setDate(secondDate.getDate() - 1);
    } else {
      firstDate = new Date(firstDateStr || new Date());
      secondDate = new Date(secondDateStr);
    }

    const formatDate = (date: Date) =>
        date.toISOString().split("T")[0];

    const firstDateFormatted = formatDate(firstDate);
    const secondDateFormatted = formatDate(secondDate);


    async function getRatesByDate(date: string): Promise<ExchangeRateData[]> {
      const result = await client.query(
          `
        SELECT 
          er.id as exchange_id,
          er.date,
          er.value,
          c.id as currency_id,
          c.code,
          c.name,
          c.icon
        FROM exchange_rate er
        JOIN currency c ON er.currencyId = c.id
        WHERE er.date = $1
        ORDER BY c.code ASC
      `,
          [date]
      );

      return result.rows.map((row) => ({
        id: row.exchange_id,
        date: new Date(row.date),
        value: Number(row.value),
        currency: {
          id: row.currency_id,
          code: row.code,
          name: row.name,
          icon: row.icon,
        },
      }));
    }

    const [firstDateRates, secondDateRates] = await Promise.all([
      getRatesByDate(firstDateFormatted),
      getRatesByDate(secondDateFormatted),
    ]);

    const response: ExchangeRateResponse = {
      firstDate: firstDateRates,
      secondDate: secondDateRates,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=21600", // Cache for 1 hour, stale for 6 hours
      },
    });
  } catch (error) {
    console.error("Error fetching exchange rates by dates:", error);
    return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
    );
  } finally {
    client.release();
  }
}