import pool, {createTables} from "@/lib/db";
import {NextResponse} from 'next/server';
import {PoolClient} from "pg";
import getExchangeRate, {RateData} from "@/lib/api";
import {format} from "date-fns";

let isSyncActive = false;
const minDate = new Date(2021,0,1);
let lastSyncDate = new Date(2021,0,1);
const batchSize = 30;

async function getLastSync(client: PoolClient) {
    try{
        const lastSyncQuery = await client.query(
            `SELECT MAX(date) as last_sync FROM exchange_rate`
        );
        lastSyncDate = lastSyncQuery.rows[0]?.last_sync || minDate;
        if(lastSyncDate > minDate){
            lastSyncDate.setDate(lastSyncDate.getDate() + 1);
        }
    }catch(err){
        console.error('Error in getLastSync', err);
    }
}

async function getCurrencyMap(client: PoolClient): Promise<Record<string, number>> {
    const map: Record<string, number> = {};
    try{
        const result = await client.query(`SELECT id, code FROM currency`);
        for (const row of result.rows) {
            map[row.code] = row.id;
        }
    }catch(error){
        console.error('Error in getCurrencyMap', error);
    }
    return map;
}

const wait = (ms: number) =>
    new Promise((resolve) =>
        setTimeout(resolve, ms));

async function fetchWithRetries(date: Date, retries = 4, delayMs = 300): Promise<RateData | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await getExchangeRate(date);
        } catch (error) {
            console.warn(`Failed ${attempt} attempt for date ${format(date, "yyyy-MM-dd")}`, error);
            if (attempt < retries) {
                await wait(delayMs);
            }
        }
    }
    console.error('Failed to fetch rate data', date, retries);
    return null;
}

async function insertExchangeRates(client: PoolClient, rates: { date: string; value: number; currencyId: number }[]) {
    if (rates.length === 0) return;

    try{
        const values: any[] = [];
        const params: string[] = [];

        rates.forEach(({ date, value, currencyId }, i) => {
            const idx = i * 3;
            params.push(`($${idx + 1}, $${idx + 2}, $${idx + 3})`);
            values.push(date, value, currencyId);
        });

        const query = `
        INSERT INTO exchange_rate (date, value, currencyId)
        VALUES ${params.join(", ")}
        ON CONFLICT DO NOTHING
    `;
        await client.query(query, values);
    }catch(err){
        console.error('Error in insertExchangeRates', err);
    }
}

export async function GET() {

    if(isSyncActive){
        return NextResponse.json({
            success: false,
            message: 'Sincronización en proceso'
        });
    }

    isSyncActive = true;
    console.info('Sync started')

    const client = await pool.connect();
    await createTables(client);
    await getLastSync(client);
    const currencyMap = await getCurrencyMap(client);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let batchRates: { date: string; value: number; currencyId: number }[] = [];

    for (
        let date = new Date(lastSyncDate);
        date <= today;
        date.setDate(date.getDate() + 1)
    ) {
        const rateData = await fetchWithRetries(new Date(date));
        if (!rateData) {
            console.warn(`Could not fetch data for date ${format(date, "yyyy-MM-dd")}, skipping.`);
            continue;
        }

        const dateStr = format(date, "yyyy-MM-dd");
        const tasas = rateData.tasas;

        for (const [code, value] of Object.entries(tasas)) {
            if (value === undefined || value === null) continue;
            const currencyId = currencyMap[code];
            if (!currencyId) {
                console.warn(`Currency not found in DB: ${code}, skipping.`);
                continue;
            }
            batchRates.push({
                date: dateStr,
                value,
                currencyId,
            });

            if (batchRates.length >= batchSize) {
                await insertExchangeRates(client, batchRates);
                batchRates = [];
            }
        }
    }

    if (batchRates.length > 0) {
        await insertExchangeRates(client, batchRates);
    }

    isSyncActive = false;
    client.release();
    console.info('Sync finished');
    return NextResponse.json({
        success: true,
        message: 'Sincronización terminada'
    });
}