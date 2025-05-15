"use client"

import {useState, useEffect} from "react"
import {DatePicker} from "@/components/ui/date-picker"
import {ExchangeRateCard} from "@/components/exchange-rate-card"
import {Skeleton} from "@/components/ui/skeleton"
import {format, subDays} from "date-fns"
import {es} from "date-fns/locale"
import {AlertCircle, RefreshCw} from "lucide-react"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Button} from "@/components/ui/button"
import {ExchangeRateData, ExchangeRateResponse} from "@/types/exchange-rate";
import {CurrencyData} from "@/types/currency-data";
import {useToast} from "@/hooks/use-toast"
import {TooltipContent, TooltipProvider, TooltipTrigger, Tooltip} from "@/components/ui/tooltip";
import {useConfig} from "@/hooks/use-config";
import {AppConfig} from "@/types/config";


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

export function ExchangeRatesDashboard() {
    const [date, setDate] = useState<Date>(new Date())
    const [currentRates, setCurrentRates] = useState<ExchangeRateData[] | null>(null)
    const [previousRates, setPreviousRates] = useState<ExchangeRateData[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isOffline, setIsOffline] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
    const {toast} = useToast()

    const fetchRates = async (selectedDate: Date) => {
        setLoading(true)
        setError(null)
        setIsOffline(false)

        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const currentKey = `rates-${formattedDate}`

        const previousDay = subDays(selectedDate, 1)
        const formattedPreviousDate = format(previousDay, "yyyy-MM-dd");
        const previousKey = `rates-${formattedPreviousDate}`

        try {
            if (currencies.length === 0) {
                const currencyResponse = await fetch(`/api/currencies`)
                if (!currencyResponse.ok) {
                    const cachedCurrencies = getFromLocalStorage('currency')
                    if (cachedCurrencies) {
                        setCurrencies(cachedCurrencies)
                    } else {
                        throw new Error("Error al obtener las monedas")
                    }
                } else {
                    const data: CurrencyData[] = await currencyResponse.json()
                    setCurrencies(data)
                    const config: AppConfig = getFromLocalStorage('tasas-cuba-config')
                    if(config && config?.privacy?.saveOfflineData){
                        saveToLocalStorage('currency', data)
                    }
                }
            }

            if (!navigator.onLine) {
                const cachedCurrentData = getFromLocalStorage(currentKey)
                const cachedPreviousData = getFromLocalStorage(previousKey)

                if (cachedCurrentData && cachedPreviousData) {
                    setCurrentRates(cachedCurrentData)
                    setPreviousRates(cachedPreviousData)
                    setIsOffline(true)
                } else {
                    throw new Error("No hay datos disponibles sin conexión para esta fecha")
                }
            } else {
                const firstDate = encodeURIComponent(formattedDate)
                const secondDate = encodeURIComponent(formattedPreviousDate)

                const response = await fetch(`/api/exchange-rates?first_date=${firstDate}&second_date=${secondDate}`)

                if (!response.ok) {
                    throw new Error("Error al obtener las tasas de cambio")
                }

                const data: ExchangeRateResponse = await response.json()
                if (data.firstDate.length === 0) {
                    toast({
                        title: "Datos insuficientes",
                        description: "Actualmente no existen suficientes datos para el día seleccionado. Estableciendo la fecha para el último día registrado.",
                        duration: 5000
                    })
                    setDate(subDays(new Date(), 1))
                    return;
                }

                setCurrentRates(data.firstDate)
                const config: AppConfig = getFromLocalStorage('tasas-cuba-config')
                if (data.firstDate.length > 0 && config && config?.privacy?.saveOfflineData)
                    saveToLocalStorage(currentKey, data)
                setPreviousRates(data.secondDate)
                if (data.secondDate.length > 0 && config && config?.privacy?.saveOfflineData)
                    saveToLocalStorage(previousKey, data.secondDate)
            }
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Error desconocido")

            const cachedCurrentData = getFromLocalStorage(currentKey)
            const cachedPreviousData = getFromLocalStorage(previousKey)

            if (cachedCurrentData && cachedPreviousData) {
                setCurrentRates(cachedCurrentData)
                setPreviousRates(cachedPreviousData)
                setIsOffline(true)
                setError("Usando datos almacenados localmente. Algunos datos pueden no estar actualizados.")
            }
        } finally {
            setLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        fetchRates(date)
    }, [date])

    const handleRefresh = () => {
        setIsRefreshing(true)
        fetchRates(date)
    }

    const formatTime = (hours: number, minutes: number) => {
        const period = hours >= 12 ? "PM" : "AM";
        const hour12 = hours % 12 === 0 ? 12 : hours % 12;
        return `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Selecciona una fecha</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ver tasas de cambio históricas</p>
                </div>
                <div className="flex gap-2">
                    <DatePicker date={date} onSelect={(date) => date && setDate(date)} locale={es} disabled={loading}
                                maxDate={new Date()} minDate={new Date(2021, 0, 1)}/>
                    <TooltipProvider>
                        <Tooltip supportMobileTap delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleRefresh}
                                    disabled={loading || isRefreshing}
                                    className="h-11 w-11 dark:hover:bg-slate-700 dark:bg-slate-800  dark:border-slate-700"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}/>
                                    <span className="sr-only">Actualizar</span>
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

            {error && (
                <Alert variant={isOffline ? "default" : "destructive"}>
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>{isOffline ? "Modo sin conexión" : "Error"}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({length: 6}).map((_, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-4">
                            <Skeleton className="h-8 w-3/4"/>
                            <Skeleton className="h-12 w-1/2"/>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-2/3"/>
                            </div>
                        </div>
                    ))}
                </div>
            ) : currentRates && previousRates ? (
                <>
                    <div
                        className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6 transition-all duration-200 hover:shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">Información
                                    actualizada</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Fecha: {format(date, "dd 'de' MMMM 'de' yyyy", {locale: es})}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
                                {isOffline && (
                                    <span
                                        className="text-sm px-3 py-1 md:mt-0 mt-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full font-medium whitespace-nowrap">
          Datos almacenados localmente
        </span>
                                )}
                                {currentRates && (
                                    <div
                                        className="text-sm px-3 py-1 md:mt-0 mt-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full font-medium whitespace-nowrap">
                                        Actualizado a las {formatTime(new Date().getHours(), new Date().getMinutes())}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentRates &&
                            previousRates &&
                            (() => {
                                const currencyOrder = ["USD", "ECU", "MLC", "TRX", "USDT_TRC20", "BTC"]

                                return currencyOrder.map((currency) => {
                                    const exchangeRate = currentRates.find(x => x.currency.code === currency);
                                    const previousExchangeRate = previousRates.find(x => x.currency.code === currency);

                                    const rate = exchangeRate?.value ?? previousExchangeRate?.value ?? 1
                                    const previousRate = previousExchangeRate?.value ?? 1
                                    const change = rate - previousRate
                                    const percentChange = (change / previousRate) * 100

                                    return (
                                        <ExchangeRateCard
                                            key={currency}
                                            currency={currency}
                                            currencyName={currencies.find(x => x.code === currency)?.name || currency}
                                            icon={currencies.find(x => x.code === currency)?.icon || "💱"}
                                            currentRate={rate}
                                            previousRate={previousRate}
                                            change={change}
                                            percentChange={percentChange}
                                        />
                                    )
                                })
                            })()}
                    </div>
                </>
            ) : null}
        </div>
    )
}
