import pool from "@/lib/db";
import { NextResponse } from "next/server";
import {ExchangeRateData} from "@/types/exchange-rate";
import {HistoricalData} from "@/types/historical-data";

export async function GET(request: Request) {
    const client = await pool.connect();

    try {
        const { searchParams } = new URL(request.url);
        const codeFilter = searchParams.get("code");

        let query = `
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
        `;

        const params: any[] = [];

        if (codeFilter) {
            query += ` WHERE c.code = $1 `;
            params.push(codeFilter);
        }

        query += ` ORDER BY er.date DESC, c.code ASC `;

        const result = await client.query(query, params);

        const data: ExchangeRateData[] = result.rows.map((row) => ({
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

        const response: HistoricalData = { data};

        return NextResponse.json(response, {
            headers: {
                "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600", // Cache for 30 minutes, stale for 1 hour
            },
        });
    } catch (error) {
        console.error("Error fetching historical data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}