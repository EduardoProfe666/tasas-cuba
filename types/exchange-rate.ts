import {CurrencyData} from "@/types/currency-data";

export interface ExchangeRateData{
    id: number;
    date: Date;
    value: number;
    currency: CurrencyData;
}

export interface ExchangeRateResponse{
    firstDate: ExchangeRateData[];
    secondDate: ExchangeRateData[];
}