import {Pool, PoolClient} from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE,
});

const currencyNames: Record<string, string> = {
    USD: "Dólar Estadounidense",
    TRX: "Tron",
    MLC: "Moneda Libremente Convertible",
    ECU: "Euro",
    USDT_TRC20: "Tether (USDT)",
    BTC: "Bitcoin",
};

const currencyIcons: Record<string, string> = {
    USD: "💵",
    TRX: "🪙",
    MLC: "💳",
    ECU: "💶",
    USDT_TRC20: "🔷",
    BTC: "₿",
};

export async function insertCurrencies(client: PoolClient) {
    try {
        for (const code of Object.keys(currencyNames)) {
            const name = currencyNames[code];
            const icon = currencyIcons[code] || '';

            await client.query(
            `
                INSERT INTO currency (code, name, icon)
                VALUES ($1, $2, $3)
                ON CONFLICT (code) DO NOTHING
            `,
                [code, name, icon]
            );
        }
        console.log('Inserted currencies correctly');
    } catch (error) {
        console.error('Error inserting currencies:', error);
    }
}

export const createTables = async (client: PoolClient) => {
    try{
        await client.query(`
          CREATE TABLE IF NOT EXISTS currency (
            id SERIAL PRIMARY KEY,
            code VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(70) NOT NULL,
            icon TEXT NOT NULL
          )
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS exchange_rate (
            id SERIAL PRIMARY KEY,
            date DATE NOT NULL,
            value INTEGER NOT NULL,
            currencyId INTEGER REFERENCES currency(id)
          )
        `);

        await insertCurrencies(client);
    }catch(err){
        console.error("Error creating tables from database:", err)
    }
}

export default pool;