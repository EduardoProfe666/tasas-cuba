import pool from "@/lib/db";
import { NextResponse } from "next/server";
import {CurrencyData} from "@/types/currency-data";

export async function GET() {
    const client = await pool.connect();

    try {
        const result = await client.query(`
            SELECT id, code, name, icon 
            FROM currency
            ORDER BY code ASC
        `);

        const currencies: CurrencyData[] = result.rows.map(row => ({
            id: row.id,
            code: row.code,
            name: row.name,
            icon: row.icon
        }));

        return NextResponse.json(currencies, {
            headers: {
                "Cache-Control": "public, max-age=1800, stale-while-revalidate=3600", // Cache for 30 minutes, stale for 1 hour
            },
        });

    } catch (error) {
        console.error("Error fetching currencies:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
