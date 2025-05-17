"use client"

import {useState} from "react"
import {Label} from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {motion} from "framer-motion"
import {ExchangeRateData} from "@/types/exchange-rate";

interface CurrencySelectorProps {
    value: string
    onChange: (value: string) => void
    rates: ExchangeRateData[]
}

const currencyNames: Record<string, string> = {
    USD: "Dólar Estadounidense",
    TRX: "Tron",
    MLC: "Moneda Libremente Convertible",
    ECU: "Euro",
    USDT_TRC20: "Tether (USDT)",
    BTC: "Bitcoin",
    CUP: "Peso Cubano",
}

const currencyIcons: Record<string, string> = {
    USD: "💵",
    TRX: "🪙",
    MLC: "💳",
    ECU: "💶",
    USDT_TRC20: "🔷",
    BTC: "₿",
    CUP: "🇨🇺",
}

export function CurrencySelector({value, onChange, rates}: CurrencySelectorProps) {
    const [open, setOpen] = useState(false)

    // Ordenar las monedas: CUP primero, luego el resto alfabéticamente
    const sortedCurrencies = rates
        ? [
            "CUP",
            ...rates.map(x => x.currency.code)
                .filter((c) => c !== "CUP")
                .sort(),
        ]
        : ["CUP", "USD", "ECU", "MLC", "TRX", "USDT_TRC20", "BTC"]

    return (
        <div className="space-y-2">
            <Label htmlFor="currency-selector" className="text-base font-medium text-slate-800 dark:text-slate-200">
                Moneda base
            </Label>
            <Select value={value} onValueChange={onChange} open={open} onOpenChange={setOpen}>
                <SelectTrigger
                    id="currency-selector"
                    className="w-full h-12 text-base border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg"
                >
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-xl">{currencyIcons[value] || "💱"}</span>
                        <div className="flex flex-col items-start">
                            <span>{value.trim() === 'ECU' ? 'EUR' : value.trim()}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {currencyNames[value] || value}
                              </span>
                        </div>
                    </div>
                </SelectTrigger>
                <SelectContent className="max-h-[300px] dark:bg-slate-800">
                    <SelectGroup>
                        <SelectLabel>Selecciona una moneda</SelectLabel>
                        {sortedCurrencies.map((currency) => (
                            <SelectItem key={currency} value={currency} className="flex items-center py-2.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{currencyIcons[currency] || "💱"}</span>
                                    <div className="flex flex-col">
                                        <span>{currency === 'ECU' ? 'EUR' : currency}</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                      {currencyNames[currency] || currency}
                    </span>
                                    </div>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
