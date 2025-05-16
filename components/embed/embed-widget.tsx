"use client"

import {useState, useEffect} from "react"
import {format} from "date-fns"
import {es} from "date-fns/locale"
import {ArrowDown, ArrowUp, ExternalLink, Loader2, Minus} from "lucide-react"
import {cn} from "@/lib/utils"
import {ExchangeRateData, ExchangeRateResponse} from "@/types/exchange-rate";

interface ExchangeRates {
    USD: number
    TRX: number
    MLC: number
    ECU: number
    USDT_TRC20: number
    BTC: number
}

interface RateData {
    tasas: ExchangeRates
    date: string
    hour: number
    minutes: number
    seconds: number
}

interface EmbedWidgetProps {
    currencies: string[]
    title?: string
    showDate?: boolean
    showHeader?: boolean
    compact?: boolean
    showBranding?: boolean
}

const currencyNames: Record<string, string> = {
    USD: "Dólar Estadounidense",
    TRX: "Tron",
    MLC: "Moneda Libremente Convertible",
    ECU: "Euro",
    USDT_TRC20: "Tether (USDT)",
    BTC: "Bitcoin",
}

const currencyIcons: Record<string, string> = {
    USD: "💵",
    TRX: "🪙",
    MLC: "💳",
    ECU: "💶",
    USDT_TRC20: "🔷",
    BTC: "₿",
}

export function EmbedWidget({
                                currencies,
                                title = "🔥 Candela 🔥",
                                showDate = true,
                                showHeader = true,
                                compact = false,
                                showBranding = true,
                            }: EmbedWidgetProps) {
    const [currentRates, setCurrentRates] = useState<ExchangeRateData[]>([])
    const [previousRates, setPreviousRates] = useState<ExchangeRateData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Obtener fecha actual formateada
                const today = new Date()
                const formattedDate = format(today, "yyyy-MM-dd")

                // Obtener fecha de ayer
                const yesterday = new Date(today)
                yesterday.setDate(yesterday.getDate() - 1)
                const formattedYesterday = format(yesterday, "yyyy-MM-dd")

                // Construir URLs para las API
                const firstDate = encodeURIComponent(formattedDate)
                const secondDate = encodeURIComponent(formattedYesterday)

                const response = await fetch(`/api/exchange-rates?first_date=${firstDate}&second_date=${secondDate}`)

                if (!response.ok) {
                    throw new Error("Error al obtener las tasas de cambio")
                }

                const data: ExchangeRateResponse = await response.json()

                const todayData = data.firstDate
                const yesterdayData = data.secondDate

                setCurrentRates(todayData)
                setPreviousRates(yesterdayData)
            } catch (err) {
                console.error(err)
                setError(err instanceof Error ? err.message : "Error desconocido")
            } finally {
                setLoading(false)
            }
        }

        fetchRates()
    }, [])

    const formatTime = (hours: number, minutes: number) => {
        const period = hours >= 12 ? "pm" : "am";
        const hours12 = hours % 12 === 0 ? 12 : hours % 12;
        const minutesStr = minutes.toString().padStart(2, "0");
        return `${hours12}:${minutesStr} ${period}`;
    }


    if (loading) {
        return (
            <div
                className="flex items-center justify-center h-full min-h-[100px] w-full bg-white dark:bg-slate-900 rounded-lg p-4">
                <Loader2 className="h-6 w-6 text-orange-500 animate-spin"/>
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Cargando tasas...</span>
            </div>
        )
    }

    if (error || !currentRates || !previousRates) {
        return (
            <div
                className="flex items-center justify-center h-full min-h-[100px] w-full bg-white dark:bg-slate-900 rounded-lg p-4">
                <div className="text-center text-sm text-rose-600 dark:text-rose-400">
                    No se pudo cargar las tasas de cambio
                </div>
            </div>
        )
    }

    return (
        <div
            className={cn(
                "w-full h-full bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex flex-col",
                "border border-slate-200 dark:border-slate-800",
                "font-sans text-slate-900 dark:text-slate-100",
                compact ? "text-sm" : "text-base",
            )}
        >
            {showHeader && (
                <div
                    className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
                    <h1 className={cn("font-medium text-amber-700 dark:text-orange-400", compact ? "text-sm" : "text-base")}>
                        {title}
                    </h1>
                    {showDate && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {format(new Date(currentRates[0]?.date ?? null), "dd 'de' MMMM 'de' yyyy", {locale: es})} •
                            Actualizado a las{" "}
                            {formatTime(new Date().getHours(), new Date().getMinutes())}
                        </div>
                    )}
                </div>
            )}

            <div className={cn("flex-1 overflow-y-auto", compact ? "p-2" : "p-3")}>
                <div className="space-y-2">
                    {currencies.map((currency) => {
                        const r1 = currentRates.find(x => x.currency.code === currency);
                        const r2 = previousRates.find(x => x.currency.code === currency);
                        const rate = r1?.value ?? -1
                        const previousRate = r2?.value ?? 1
                        const change = rate - previousRate
                        const percentChange = (change / previousRate) * 100
                        const isPositive = change > 0
                        const isNeutral = change === 0 || rate === -1

                        return (
                            <div
                                key={currency}
                                className={cn(
                                    "flex items-center justify-between",
                                    "p-2 rounded-lg",
                                    "bg-white dark:bg-slate-800",
                                    "border border-slate-100 dark:border-slate-700",
                                    "hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors",
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-lg">
                                        {currencyIcons[currency] || "💱"}
                                    </div>
                                    <div>
                                        <div className="font-medium">{currency === 'ECU' ? 'EUR' : currency}</div>
                                        {!compact && (
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                                {currencyNames[currency] || currency}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <div className="font-bold">{rate === -1 ? '---' : rate} CUP</div>
                                        {!compact && (<div
                                                className={cn(
                                                    "text-xs flex items-center justify-end gap-1",
                                                    isNeutral
                                                        ? "text-slate-500"
                                                        : isPositive
                                                            ? "text-rose-600 dark:text-rose-400"
                                                            : "text-emerald-600 dark:text-emerald-400",
                                                )}
                                            >
                                                {isNeutral ? (
                                                    <Minus className="h-3 w-3"/>
                                                ) : isPositive ? (
                                                    <ArrowUp className="h-3 w-3"/>
                                                ) : (
                                                    <ArrowDown className="h-3 w-3"/>
                                                )}
                                                <span>
    {rate === -1
        ? '---' :
        isNeutral ? ''
        : `${isPositive ? '+' : '-'}${Math.abs(change).toFixed(2)} CUP (${Math.abs(percentChange).toFixed(2)}%)`
    }
  </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {showBranding && (
                <div
                    className="px-3 py-2 text-xs text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <a
                        href="https://candela.medialityc.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                        candela.medialityc.com
                        <ExternalLink className="ml-1 h-3 w-3"/>
                    </a>
                </div>
            )}
        </div>
    )
}
