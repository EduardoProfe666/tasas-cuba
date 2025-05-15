"use client"
import * as Select from "@radix-ui/react-select"

import {useEffect, useRef, useState} from "react"
import {CurrencyData} from "@/types/currency-data"
import {ExchangeRateData, ExchangeRateResponse} from "@/types/exchange-rate"
import {format, subDays} from "date-fns"
import {motion, AnimatePresence} from "framer-motion"
import {ArrowRightLeft, CalendarDays, ChevronDown, Loader2, RefreshCcw, Repeat2} from "lucide-react"
import clsx from "clsx"
import {InfoDisclaimer} from "@/components/info-disclaimer";
import {es} from "date-fns/locale";
import { DatePicker } from "@/components/ui/date-picker"
import {useConfig} from "@/hooks/use-config";
import {AppConfig} from "@/types/config";

const MIN_DATE = new Date(2021, 0, 1)
const TODAY = new Date()

const saveToLocalStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.error("Error saving to localStorage:", error)
    }
}

const getFromLocalStorage = (key: string) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    } catch (error) {
        console.error("Error getting from localStorage:", error)
        return null
    }
}

export default function Calculator() {
    const [currencies, setCurrencies] = useState<CurrencyData[]>([])
    const [exchangeRates, setExchangeRates] = useState<ExchangeRateData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // UI States
    const [amount, setAmount] = useState<number | "">("")
    const [direction, setDirection] = useState<"CUP_TO_OTHER" | "OTHER_TO_CUP">("CUP_TO_OTHER")
    const [targetCurrency, setTargetCurrency] = useState<CurrencyData | null>(null)
    const [result, setResult] = useState<number | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date>(TODAY)

    const currencyOrder = ["USD", "ECU", "MLC", "TRX", "USDT_TRC20", "BTC"]

    const handleDateChange = (date: Date | undefined) => {
        if (!date) return
        if (date < MIN_DATE || date > TODAY) return
        setSelectedDate(date)
        fetchData(date)
    }

    // Fetch data
    const fetchData = async (date?: any) => {
        setIsLoading(true)
        setError(null)
        try {
            // Currencies
            const currencyResponse = await fetch(`/api/currencies`)
            let currencyData: CurrencyData[]
            if (!currencyResponse.ok) {
                const cachedCurrencies = getFromLocalStorage('currency')
                if (cachedCurrencies) {
                    currencyData = cachedCurrencies
                } else {
                    throw new Error("Error al obtener las monedas")
                }
            } else {
                currencyData = await currencyResponse.json()
                const config: AppConfig = getFromLocalStorage('tasas-cuba-config')
                if(config && config?.privacy?.saveOfflineData)
                    saveToLocalStorage('currency', currencyData)
            }
            setCurrencies(currencyData)

            const formattedDate = format(date instanceof Date ? date ?? new Date() : new Date(), "yyyy-MM-dd")
            const formattedPreviousDate = format(subDays(date instanceof Date ? date ?? new Date() : new Date(), 1), "yyyy-MM-dd")
            const firstDate = encodeURIComponent(formattedDate)
            const secondDate = encodeURIComponent(formattedPreviousDate)

            let ratesData: ExchangeRateData[] = []
            try {
                const response = await fetch(`/api/exchange-rates?first_date=${firstDate}&second_date=${secondDate}`)
                if (!response.ok) throw new Error("Error al obtener las tasas de cambio")
                const data: ExchangeRateResponse = await response.json()
                if (data.firstDate.length > 0) {
                    ratesData = data.firstDate
                } else if (data.secondDate.length > 0) {
                    ratesData = data.secondDate
                }
            } catch (error) {
                const cachedCurrentData = getFromLocalStorage(`rates-${formattedDate}`)
                const cachedPreviousData = getFromLocalStorage(`rates-${formattedPreviousDate}`)
                ratesData = cachedCurrentData?.length > 0 ? cachedCurrentData : cachedPreviousData?.length > 0 ? cachedPreviousData : []
            }
            setExchangeRates(ratesData)

            if (currencyData.length > 0) {
                const defaultTarget = currencyData.find(c => c.code === "USD")
                setTargetCurrency(defaultTarget || null)
            }
        } catch (err: any) {
            setError(err.message || "Error al cargar datos")
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (
            typeof amount === "number" &&
            amount > 0 &&
            targetCurrency &&
            exchangeRates.length > 0
        ) {
            const rate = exchangeRates.find(er => er.currency.code === targetCurrency.code)
            if (rate) {
                if (direction === "CUP_TO_OTHER") {
                    setResult(amount / rate.value)
                } else {
                    setResult(amount * rate.value)
                }
            } else {
                setResult(null)
            }
        } else {
            setResult(null)
        }
    }, [amount, targetCurrency, exchangeRates, direction])


    const handleSwap = () => {
        setDirection(prev =>
            prev === "CUP_TO_OTHER" ? "OTHER_TO_CUP" : "CUP_TO_OTHER"
        )
        setAmount("")
        setResult(null)
    }

    const rate = targetCurrency
        ? exchangeRates.find(er => er.currency.code === targetCurrency.code)
        : null;

    const [rotation, setRotation] = useState(0)

    const handleSwapWithRotation = () => {
        setRotation(prev => prev + 180)
        handleSwap()
    }

    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef<HTMLSelectElement>(null)

    const handleFocus = () => setIsOpen(true)
    const handleBlur = () => setIsOpen(false)

    return (
        <section
            className="max-w-xl mx-auto bg-white/70 dark:bg-slate-900/70 rounded-2xl shadow-lg p-6 md:p-10 border border-slate-100 dark:border-slate-800 relative">
            {/* Loader */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        key="loader"
                        className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 rounded-2xl z-10"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                    >
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500"/>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error */}
            {error && (
                <motion.div
                    className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200 text-center"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                >
                    {error}
                </motion.div>
            )}

            {/* Formulario */}
            <form
                className={clsx("flex flex-col gap-6", isLoading && "pointer-events-none opacity-60")}
                onSubmit={e => e.preventDefault()}
                autoComplete="off"
            >
                {/* Input de origen */}
                <div>
                    <label htmlFor="amount"
                           className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        {direction === "CUP_TO_OTHER" ? (
                            <>Cantidad en <span
                                className="font-bold text-emerald-600 dark:text-emerald-400">CUP</span></>
                        ) : (
                            <>Cantidad en <span
                                className="font-bold text-emerald-600 dark:text-emerald-400">{targetCurrency?.code === "ECU" ? "EUR" : targetCurrency?.code || "Moneda"}</span></>
                        )}
                    </label>
                    <input
                        id="amount"
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={amount}
                        onChange={e => {
                            const val = e.target.value
                            setAmount(val === "" ? "" : Math.max(0, Number(val)))
                        }}
                        placeholder={direction === "CUP_TO_OTHER"
                            ? "Introduce la cantidad en pesos cubanos"
                            : `Introduce la cantidad en ${targetCurrency?.name || "moneda"}`}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-md font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                </div>

                {/* Selector y botón de swap */}
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <label
                            htmlFor="currency"
                            className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1"
                        >
                            {direction === "CUP_TO_OTHER" ? "Convertir a" : "Convertir desde"}
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                                <select
                                    id="currency"
                                    ref={selectRef}
                                    value={targetCurrency?.code || ""}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    onChange={e => {
                                        const code = e.target.value
                                        const selected = currencies.find(c => c.code === code)
                                        setTargetCurrency(selected || null)
                                    }}
                                    className="cursor-pointer w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-md font-medium text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                                >
                                    {currencies
                                        .filter(c => c.code !== "CUP")
                                        .sort((a, b) => {
                                            const indexA = currencyOrder.indexOf(a.code)
                                            const indexB = currencyOrder.indexOf(b.code)
                                            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
                                        })
                                        .map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.icon ? `${currency.icon} ` : ""}
                                                {currency.name} ({currency.code === "ECU" ? "EUR" : currency.code})
                                            </option>
                                        ))}
                                </select>
                                <motion.span
                                    animate={{rotate: isOpen ? 180 : 0}}
                                    transition={{type: "spring", stiffness: 300, damping: 20}}
                                    className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400 select-none"
                                >
                                    <ChevronDown className="w-6 h-6"/>
                                </motion.span>
                            </div>
                            <button
                                type="button"
                                onClick={handleSwapWithRotation}
                                className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-700 dark:text-emerald-300 transition flex-shrink-0"
                                aria-label="Invertir dirección"
                                title="Invertir dirección"
                            >
                                <motion.div
                                    animate={{rotate: rotation}}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15
                                    }}
                                >
                                    <Repeat2 className="w-6 h-6"/>
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>


                {/* Selector de fecha */}
                <div className="w-full">
                    <label
                        htmlFor="date-picker"
                        className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1"
                    >
                        Selecciona la fecha de las tasas
                    </label>
                    <DatePicker
                        date={selectedDate}
                        onSelect={handleDateChange}
                        minDate={MIN_DATE}
                        maxDate={TODAY}
                        locale={es}
                        fixedWidthMd={false}
                    />
                </div>


                {/* Resultado */}
                <motion.div
                    key={result !== null ? "result" : "noresult"}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{type: "spring", stiffness: 300, damping: 24}}
                    className="flex flex-col items-center justify-center mt-2"
                >
                    {result !== null && targetCurrency && (
                        <div
                            className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                            {direction === "CUP_TO_OTHER" ? (
                                <>
                                    {targetCurrency.icon && (
                                        <span className="text-3xl">{targetCurrency.icon}</span>
                                    )}
                                    <span>
                    {result.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}{" "}
                                        <span className="font-semibold">
                      {targetCurrency.code === 'ECU' ? 'EUR' : targetCurrency.code}
                    </span>
                  </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-3xl">🇨🇺</span>
                                    <span>
                    {result.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}{" "}
                                        <span className="font-semibold">CUP</span>
                  </span>
                                </>
                            )}
                        </div>
                    )}

                    {rate && result != null && targetCurrency && (
                        <div className="flex flex-col items-center gap-1 mt-3">
                            <div
                                className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm">
                                <ArrowRightLeft className="w-4 h-4"/>
                                <span>
                                    1 <span className="font-bold">{direction === "CUP_TO_OTHER" ? 'CUP' : (targetCurrency.code === 'ECU' ? 'EUR' : targetCurrency.code)}</span>
                                    <span className="mx-1">=</span>
                                    <span className="font-mono">{direction === "CUP_TO_OTHER" ? (rate.value > 0 ? (1/rate.value).toFixed(6) : 0) : rate.value}</span> <span
                                    className="font-bold">{direction === "CUP_TO_OTHER" ? (targetCurrency.code === 'ECU' ? 'EUR' : targetCurrency.code) : 'CUP'}</span>
                                  </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                <CalendarDays className="w-4 h-4"/>
                                <span>
                                {rate.date
                                    ? <span
                                        className="font-mono">{format(new Date(rate.date), "dd 'de' MMMM 'de' yyyy", {locale: es})}</span>
                                    : "--"}
                              </span>
                            </div>
                        </div>
                    )}

                </motion.div>

                {/* Refrescar tasas */}
                <div className="flex justify-between">
                    <InfoDisclaimer variant="compact"/>
                    <button
                        type="button"
                        onClick={fetchData}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
                        aria-label="Actualizar tasas"
                        disabled={isLoading}
                    >
                        <RefreshCcw className={clsx("w-4 h-4", isLoading && "animate-spin")}/>
                        Actualizar tasas
                    </button>
                </div>
            </form>
        </section>
    )
}
