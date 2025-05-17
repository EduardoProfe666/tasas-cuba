"use client"

import {useState, useEffect} from "react"
import {CurrencySelector} from "./currency-selector"
import {AmountInput} from "./amount-input"
import {ConversionResults} from "./conversion-results"
import {InfoDisclaimer} from "@/components/info-disclaimer"
import {format, subDays, isAfter, isBefore} from "date-fns"
import {es} from "date-fns/locale"
import {Loader2, RefreshCw, CalendarIcon, ArrowLeft} from "lucide-react"
import {Button} from "@/components/ui/button"
import {motion} from "framer-motion"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {Badge} from "@/components/ui/badge"
import {ExchangeRateData, ExchangeRateResponse} from "@/types/exchange-rate";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {DatePicker} from "@/components/ui/date-picker";

interface ExchangeRates {
    USD: number
    TRX: number
    MLC: number
    ECU: number
    USDT_TRC20: number
    BTC: number
    CUP: number // Añadimos CUP con valor 1
}

interface RateData {
    tasas: ExchangeRates
    date: string
    hour: number
    minutes: number
    seconds: number
}

// Función para guardar datos en localStorage
const saveToLocalStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        console.error("Error saving to localStorage:", error)
    }
}

// Función para obtener datos de localStorage
const getFromLocalStorage = (key: string) => {
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    } catch (error) {
        console.error("Error getting from localStorage:", error)
        return null
    }
}

export function CurrencyCalculator() {
    const [baseCurrency, setBaseCurrency] = useState<string>("USD")
    const [amount, setAmount] = useState<string>("1")
    const [currentRates, setCurrentRates] = useState<ExchangeRateData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isOffline, setIsOffline] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [isHistorical, setIsHistorical] = useState(false)

    // Cargar tasas de cambio
    useEffect(() => {
        fetchRates(selectedDate)
    }, [selectedDate])

    const fetchRates = async (date: Date) => {
        setLoading(true)
        setError(null)
        setIsOffline(false)
        setIsRefreshing(true)

        try {
            const formattedDate = format(date ?? new Date(), "yyyy-MM-dd")
            const formattedPreviousDate = format(subDays(date ?? new Date(), 1), "yyyy-MM-dd")
            const firstDate = encodeURIComponent(formattedDate)
            const secondDate = encodeURIComponent(formattedPreviousDate)

            const response = await fetch(`/api/exchange-rates?first_date=${firstDate}&second_date=${secondDate}`)
            if (!response.ok) throw new Error("Error al obtener las tasas de cambio")

            const data: ExchangeRateResponse = await response.json()
            const data1: ExchangeRateData[] = [{
                currency: {
                    name: 'Pesos Cubanos',
                    code: 'CUP',
                    id: 666,
                    icon: '🇨🇺'
                },
                date: date,
                value: 1,
                id: 666
            }]

            console.log(data)

            if (data.firstDate.length > 0) {
                data1.push(...data.firstDate)
                setCurrentRates(data1)
            } else if (data.secondDate.length > 0) {
                data1.push(...data.secondDate)
                setCurrentRates(data1)
            } else {
                setCurrentRates([])
            }

            saveToLocalStorage(`rates-${formattedDate}`, data)
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Error desconocido")

            // Intentar obtener datos del localStorage como fallback
            const formattedDate = format(date, "yyyy-MM-dd")
            const currentKey = `rates-${formattedDate}`

            const cachedCurrentData: ExchangeRateResponse = getFromLocalStorage(currentKey)
            const data1: ExchangeRateData[] = [{
                currency: {
                    name: 'Pesos Cubanos',
                    code: 'CUP',
                    id: 666,
                    icon: '🇨🇺'
                },
                date: date,
                value: 1,
                id: 666
            }]

            if (cachedCurrentData) {
                if (cachedCurrentData.firstDate.length > 0) {
                    data1.push(...cachedCurrentData.firstDate)
                    setCurrentRates(data1)
                } else if (cachedCurrentData.secondDate.length > 0) {
                    data1.push(...cachedCurrentData.secondDate)
                    setCurrentRates(data1)
                } else {
                    setCurrentRates([])
                }
                setIsOffline(true)
                setError("Usando datos almacenados localmente. Algunos datos pueden no estar actualizados.")
            }
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        fetchRates(selectedDate)
    }

    const handleBaseCurrencyChange = (currency: string) => {
        setBaseCurrency(currency)
    }

    const handleAmountChange = (value: string) => {
        setAmount(value)
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const isToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
            setIsHistorical(!isToday)

            setSelectedDate(date)
        }
    }

    const handleResetDate = () => {
        const today = new Date()
        setSelectedDate(today)
        setIsHistorical(false)
    }

    // Obtener la tasa efectiva
    const getEffectiveRate = (currency: string): number => {
        if (currency === "CUP") return 1
        console.log(currency)
        return currentRates.find(x => x.currency.code === currency)?.value || 0
    }



    // Formatear la fecha y hora
    const formatTime = (hours: number, minutes: number) => {
        const period = hours >= 12 ? "PM" : "AM";
        const hour12 = hours % 12 === 0 ? 12 : hours % 12;
        return `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    const formatDateTime = () => {
        const date = new Date()

        const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", {locale: es})
        const formattedTime = formatTime(date.getHours(), date.getMinutes())

        return `${formattedDate} a las ${formattedTime}`
    }

    // Calcular fecha mínima y máxima para el calendario
    const minDate = subDays(new Date(), 365) // Un año atrás
    const maxDate = new Date() // Hoy

    return (
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/90 rounded-xl shadow-lg p-6 mb-8 border border-slate-100 dark:border-slate-700"
            >
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                    <div className="flex-1">
                        <CurrencySelector value={baseCurrency} onChange={handleBaseCurrencyChange}
                                          rates={currentRates}/>
                    </div>
                    <div className="flex-1">
                        <AmountInput value={amount} onChange={handleAmountChange} currency={baseCurrency}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label
                                className="text-base font-medium text-slate-800 dark:text-slate-200">Fecha</label>
                            {isHistorical && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetDate}
                                    className="h-8 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 dark:hover:bg-slate-700"
                                >
                                    <ArrowLeft className="h-3 w-3 mr-1"/>
                                    Hoy
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <DatePicker
                                date={selectedDate}
                                onSelect={handleDateChange}
                                minDate={new Date(2021, 0, 1)}
                                maxDate={new Date()}
                                locale={es}
                                fixedWidthMd={false}
                            />
                            <TooltipProvider>
                                <Tooltip supportMobileTap delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleRefresh}
                                            disabled={loading || isRefreshing}
                                            className="h-12 w-12 rounded-full bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                                            aria-label="Actualizar tasas"
                                        >
                                            {isRefreshing ? <Loader2 className="h-5 w-5 animate-spin"/> :
                                                <RefreshCw className="h-5 w-5"/>}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">
                                            Refrescar datos
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>

                {currentRates && (
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                        <span><span className="font-bold">Tasas actualizadas:</span> {formatDateTime()}</span>
                        {isOffline && (
                            <Badge
                                variant="outline"
                                className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                            >
                                Modo sin conexión
                            </Badge>
                        )}
                        {isHistorical && (
                            <Badge
                                variant="outline"
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                            >
                                Datos históricos
                            </Badge>
                        )}
                    </div>
                )}
            </motion.div>

            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 text-emerald-500 animate-spin"/>
                    <span className="ml-3 text-slate-600 dark:text-slate-400">Cargando tasas de cambio...</span>
                </div>
            ) : error && !currentRates ? (
                <div
                    className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-6 text-center text-rose-600 dark:text-rose-400">
                    {error}
                </div>
            ) : currentRates ? (
                <ConversionResults
                    baseCurrency={baseCurrency}
                    amount={Number.parseFloat(amount) || 0}
                    rates={currentRates}
                    getEffectiveRate={getEffectiveRate}
                />
            ) : null}
            <InfoDisclaimer className="mt-8"/>
        </div>
    )
}
