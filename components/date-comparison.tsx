"use client"

import { useState, useEffect } from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {format, subDays} from "date-fns"
import { es } from "date-fns/locale"
import {AlertCircle, BellRing, Scale} from "lucide-react"
import { CurrencyComparison } from "@/components/currency-comparison"
import { InfoDisclaimer } from "@/components/info-disclaimer"
import {ExchangeRateData, ExchangeRateResponse} from "@/types/exchange-rate";
import {useToast} from "@/hooks/use-toast";
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

export function DateComparison() {
    const [compareDate1, setCompareDate1] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 7)))
    const [compareDate2, setCompareDate2] = useState<Date>(new Date())
    const [compareData1, setCompareData1] = useState<ExchangeRateData[] | null>(null)
    const [compareData2, setCompareData2] = useState<ExchangeRateData[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isOffline, setIsOffline] = useState(false)
    const { toast } = useToast()

    const fetchCompareData = async () => {
        setLoading(true)
        setError(null)
        setIsOffline(false)

        try {
            if (!navigator.onLine) {
                const cachedData1 = getFromLocalStorage(`rates-${format(compareDate1, "yyyy-MM-dd")}`)
                const cachedData2 = getFromLocalStorage(`rates-${format(compareDate2, "yyyy-MM-dd")}`)

                if (cachedData1 && cachedData2) {
                    setCompareData1(cachedData1)
                    setCompareData2(cachedData2)
                    setIsOffline(true)
                    setError("Usando datos almacenados localmente. Algunos datos pueden no estar actualizados.")
                } else {
                    throw new Error("No hay datos disponibles sin conexión para estas fechas")
                }
            } else {
                const formattedDate1 = format(compareDate1, "yyyy-MM-dd")
                const formattedDate2 = format(compareDate2, "yyyy-MM-dd")

                const encodedDate1 = encodeURIComponent(formattedDate1)
                const encodedDate2 = encodeURIComponent(formattedDate2)

                const response = await fetch(`/api/exchange-rates?first_date=${encodedDate1}&second_date=${encodedDate2}`)

                if (!response.ok) {
                    throw new Error("Error al obtener las tasas de cambio")
                }

                const data: ExchangeRateResponse = await response.json()

                if(data.secondDate.length === 0){
                    toast({
                        title: "Datos insuficientes",
                        description: "Actualmente no existen suficientes datos para el día seleccionado. Estableciendo la fecha para el último día registrado.",
                        duration: 5000
                    })
                    setCompareDate1(subDays(new Date(), 2))
                    setCompareDate2(subDays(new Date(), 1))
                    return;
                }

                setCompareData1(data.firstDate)
                setCompareData2(data.secondDate)
                const config: AppConfig = getFromLocalStorage('tasas-cuba-config')

                if(data.firstDate.length > 0 && config && config?.privacy?.saveOfflineData)
                    saveToLocalStorage(`rates-${formattedDate1}`, data.firstDate)
                if(data.secondDate.length > 0 && config && config?.privacy?.saveOfflineData)
                    saveToLocalStorage(`rates-${formattedDate2}`, data.secondDate)
            }
        } catch (err) {
            console.error(err)
            setError(err instanceof Error ? err.message : "Error desconocido")

            const cachedData1 = getFromLocalStorage(`rates-${format(compareDate1, "yyyy-MM-dd")}`)
            const cachedData2 = getFromLocalStorage(`rates-${format(compareDate2, "yyyy-MM-dd")}`)

            if (cachedData1 && cachedData2) {
                setCompareData1(cachedData1)
                setCompareData2(cachedData2)
                setIsOffline(true)
                setError("Usando datos almacenados localmente. Algunos datos pueden no estar actualizados.")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCompareData()
    }, [compareDate1, compareDate2])

    return (
        <Card className="dark:bg-slate-900 shadow-lg hover-shadow-2xl dark:border-slate-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Comparación entre Fechas
                </CardTitle>
                <CardDescription>
                    Compara las tasas de cambio entre dos fechas específicas para analizar las diferencias.
                </CardDescription>
            </CardHeader>
            <CardContent>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primera fecha</label>
                        <DatePicker minDate={new Date(2021,0,1)} maxDate={compareDate2} date={compareDate1} onSelect={(date) => date && setCompareDate1(date)} locale={es} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Segunda fecha</label>
                        <DatePicker minDate={compareDate1} maxDate={new Date()} date={compareDate2} onSelect={(date) => date && setCompareDate2(date)} locale={es} />
                    </div>
                </div>

                {error && (
                    <Alert variant={isOffline ? "default" : "destructive"} className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{isOffline ? "Modo sin conexión" : "Error"}</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="w-full">
                        <Skeleton className="w-full h-96 rounded-lg" />
                    </div>
                ) : compareData1 && compareData2 ? (
                    <CurrencyComparison data1={compareData1} data2={compareData2} date1={compareDate1} date2={compareDate2} />
                ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        Selecciona dos fechas para comparar las tasas de cambio.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
