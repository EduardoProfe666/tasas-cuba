import {format} from "date-fns";

const API_URL = "https://tasas.eltoque.com/v1/trmi"
const API_TOKEN = process.env.API_KEY

export interface ExchangeRates {
    USD?: number
    TRX?: number
    MLC?: number
    ECU?: number
    USDT_TRC20?: number
    BTC?: number
}

export interface RateData {
    tasas: ExchangeRates
    date: string
    hour: number
    minutes: number
    seconds: number
}

const getExchangeRate = async (date: Date): Promise<RateData> => {
    const formattedDate = format(date, "yyyy-MM-dd")
    const dateFrom = `${formattedDate} 00:00:01`
    const dateTo = `${formattedDate} 23:59:59`

    let url = `${API_URL}?date_from=${dateFrom}&date_to=${dateTo}`

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    })

    const data = await response.json()
    const tasasMapped: ExchangeRates = {};
    for (const [key, value] of Object.entries(data.tasas)) {
        if (typeof value === 'number') {
            tasasMapped[key as keyof ExchangeRates] = Math.floor(value);
        }
    }
    return {
        date: data.date,
        hour: data.hour,
        minutes: data.minutes,
        seconds: data.seconds,
        tasas: tasasMapped,
    }
}

export default getExchangeRate;