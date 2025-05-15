"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {format, subDays, eachDayOfInterval, differenceInDays} from "date-fns"
import { es } from "date-fns/locale"
import { InfoDisclaimer } from "@/components/info-disclaimer"
import { motion } from "framer-motion"
import { TimeSeriesChart } from "./time-series-chart"
import { ChartControls } from "./chart-controls"
import { ChartSummaryDialog } from "./chart-summary-dialog"
import { CurrencySelector } from "./currency-selector"
import { TimeRangeSelector } from "./time-range-selector"
import {
    calculateSMA,
    calculateEMA,
    calculateBollingerBands,
    calculateRSI,
    calculateMACD,
    calculateStochastic, calculateCurrencyMetricsAdvanced, calculateTrend, findNextRealDateIndex, interpolateValue,
} from "./chart-utils"
import {CurrencyData} from "@/types/currency-data";
import {HistoricalData} from "@/types/historical-data";
import {ExchangeRateData} from "@/types/exchange-rate";
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

const generateHistoricalData = (startDate: Date, endDate: Date, currency: string, historicalDemand: ExchangeRateData[]) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const { baseValue, volatility } = calculateCurrencyMetricsAdvanced(historicalDemand, currency);
    const trend = calculateTrend(historicalDemand, currency);


    const dataByDate = new Map();
    historicalDemand.forEach(item => {
        if(item.currency.code === currency){
            const dateStr = format(item.date, "yyyy-MM-dd");
            dataByDate.set(dateStr, item.value);
        }
    });

    console.log(historicalDemand)

    let previousValue = baseValue;
    let lastKnownRealValue = baseValue;
    let lastKnownRealDate: any = null;

    return days.map((day, index) => {
        const dateStr = format(day, "yyyy-MM-dd");

        if (dataByDate.has(dateStr)) {
            const realValue = dataByDate.get(dateStr);
            previousValue = realValue;
            lastKnownRealValue = realValue;
            lastKnownRealDate = day;

            return {
                date: dateStr,
                [currency]: realValue,
                formattedDate: format(day, "dd/MM/yyyy", { locale: es }),
                displayDate: format(day, "dd 'de' MMMM 'de' yyyy", {locale: es}),
                isReal: true
            };
        }
        else {
            let estimatedValue;

            const nextRealDateIndex = findNextRealDateIndex(day, days, dataByDate);

            if (lastKnownRealDate && nextRealDateIndex !== -1) {
                const nextRealDate = days[nextRealDateIndex];
                const nextRealValue = dataByDate.get(format(nextRealDate, "yyyy-MM-dd"));

                estimatedValue = interpolateValue(
                    day,
                    lastKnownRealDate,
                    nextRealDate,
                    lastKnownRealValue,
                    nextRealValue
                );
            }
            else {
                const daysSinceLastReal = lastKnownRealDate
                    ? differenceInDays(day, lastKnownRealDate)
                    : index;

                const randomFactor = (Math.random() - 0.5) * volatility;
                const trendFactor = (trend * daysSinceLastReal) / days.length;

                estimatedValue = previousValue * (1 + randomFactor + trendFactor);
                estimatedValue = Math.max(estimatedValue, baseValue * 0.7);
            }

            estimatedValue = Number.parseFloat(estimatedValue.toFixed(0));
            previousValue = estimatedValue;

            return {
                date: dateStr,
                [currency]: estimatedValue,
                formattedDate: format(day, "dd/MM/yyyy", { locale: es }),
                displayDate: format(day, "dd 'de' MMMM 'de' yyyy", {locale: es}),
                isReal: false
            };
        }
    });
}

export function TimeSeriesAnalysis() {
    const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30))
    const [endDate, setEndDate] = useState<Date>(new Date())
    const [selectedCurrency, setSelectedCurrency] = useState<string>("USD")
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [chartType, setChartType] = useState<"area" | "line">("area")
    const [showAverage, setShowAverage] = useState(false)
    const [showSMA, setShowSMA] = useState(false)
    const [showEMA, setShowEMA] = useState(false)
    const [showBollinger, setShowBollinger] = useState(false)
    const [summaryOpen, setSummaryOpen] = useState(false)

    const [smaData, setSmaData] = useState<any[]>([])
    const [emaData, setEmaData] = useState<any[]>([])
    const [bollingerData, setBollingerData] = useState<any[]>([])

    const chartRef = useRef<HTMLDivElement>(null)

    const [currencies, setCurrencies] = useState<CurrencyData[]>([])
    const [historicalData, setHistoricalData] = useState<ExchangeRateData[]>([])

    useEffect(() => {
        setLoading(true)
        const fetchCurrencies = async() => {
            if(currencies.length === 0){
                const currencyResponse = await fetch(`/api/currencies`)
                if (!currencyResponse.ok) {
                    const cachedCurrencies: CurrencyData[] = getFromLocalStorage('currency')
                    if(cachedCurrencies){
                        setCurrencies(cachedCurrencies)
                        return 1
                    } else{
                        throw new Error("Error al obtener las monedas")
                    }
                }
                else{
                    const data: CurrencyData[] = await currencyResponse.json()
                    setCurrencies(data)
                    const config: AppConfig = getFromLocalStorage('tasas-cuba-config')
                    if(config && config?.privacy?.saveOfflineData){
                        saveToLocalStorage('currency', data)
                    }
                    return 1
                }
            }
        }

        const fetchHistoricalData = async() => {
            if(historicalData.length === 0){
                const historicalDataResponse = await fetch(`api/historical-data`)
                if(!historicalDataResponse.ok){
                    const cachedHistoricalData: ExchangeRateData[] = getFromLocalStorage('historical')
                    if(cachedHistoricalData){
                        setHistoricalData(cachedHistoricalData)
                        return 1
                    } else{
                        throw new Error("Error al obtener los datos históricos")
                    }
                }else{
                    const data: HistoricalData = await historicalDataResponse.json()
                    setHistoricalData(data.data)
                    const config: AppConfig = getFromLocalStorage('tasas-cuba-config')
                    if(config && config?.privacy?.saveHistory){
                        saveToLocalStorage('historical', data)
                    }
                    return 1
                }
            }
        }

        const loadData = async() => {
            const a = await fetchCurrencies()
            const b = await fetchHistoricalData()

            if(currencies.length > 0 && historicalData.length > 0 ){
                const data = generateHistoricalData(startDate, endDate, selectedCurrency, historicalData)
                setChartData(data)

                const smaResult = calculateSMA(data, selectedCurrency, 14)
                const emaResult = calculateEMA(data, selectedCurrency, 14)
                const bollingerResult = calculateBollingerBands(data, selectedCurrency, 20, 2)

                setSmaData(smaResult)
                setEmaData(emaResult)
                setBollingerData(bollingerResult)
            }

            setLoading(false)
        }

        loadData();


    }, [startDate, endDate, selectedCurrency, currencies, historicalData])

    const calculateAverage = () => {
        if (chartData.length === 0) return 0
        const sum = chartData.reduce((acc, item) => acc + item[selectedCurrency], 0)
        return sum / chartData.length
    }

    const average = calculateAverage()

    const getMinMaxValues = () => {
        if (chartData.length === 0) return { min: 0, max: 0 }

        const values = chartData.map((item) => item[selectedCurrency])
        return {
            min: Math.min(...values),
            max: Math.max(...values),
        }
    }

    const { min, max } = getMinMaxValues()
    const percentChange =
        chartData.length >= 2
            ? ((chartData[chartData.length - 1][selectedCurrency] - chartData[0][selectedCurrency]) /
                chartData[0][selectedCurrency]) *
            100
            : 0

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 shadow-lg hover-shadow-2xl">
                <CardHeader>
                    <CardTitle>Análisis Histórico de Tasas de Cambio</CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        Visualiza la evolución de las tasas a lo largo del tiempo. Selecciona un rango de fechas y la moneda que
                        deseas analizar.
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    <div className="space-y-6">
                        <TimeRangeSelector
                            startDate={startDate}
                            endDate={endDate}
                            onSelectStartDate={(date) => date && setStartDate(date)}
                            onSelectEndDate={(date) => date && setEndDate(date)}
                        />

                        <CurrencySelector currencies={currencies} selectedCurrency={selectedCurrency} onSelectCurrency={setSelectedCurrency} />

                        <ChartControls
                            chartType={chartType}
                            setChartType={setChartType}
                            showAverage={showAverage}
                            setShowAverage={setShowAverage}
                            showSMA={showSMA}
                            setShowSMA={setShowSMA}
                            showEMA={showEMA}
                            setShowEMA={setShowEMA}
                            showBollinger={showBollinger}
                            setShowBollinger={setShowBollinger}
                            onShowSummary={() => setSummaryOpen(true)}
                            chartRef={chartRef}
                            currency={selectedCurrency}
                            startDate={startDate}
                            endDate={endDate}
                        />

                        {loading ? (
                            <div className="w-full h-[400px]">
                                <Skeleton className="w-full h-full rounded-lg dark:bg-slate-800" />
                            </div>
                        ) : chartData.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                                        <CardContent className="p-4">
                                            <div className="text-sm dark:text-slate-400 text-slate-600">Valor Mínimo</div>
                                            <div className="text-2xl font-bold dark:text-slate-100">{min} CUP</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                                        <CardContent className="p-4">
                                            <div className="text-sm dark:text-slate-400 text-slate-600">Valor Máximo</div>
                                            <div className="text-2xl font-bold dark:text-slate-100">{max} CUP</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                                        <CardContent className="p-4">
                                            <div className="text-sm dark:text-slate-400 text-slate-600">Variación</div>
                                            <div
                                                className={`text-2xl font-bold ${percentChange > 0 ? "dark:text-rose-400 text-rose-500" : percentChange < 0 ? "dark:text-emerald-400 text-emerald-500" : "dark:text-slate-400 text-slate-500"}`}
                                            >
                                                {percentChange.toFixed(2)}%
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <TimeSeriesChart
                                    data={chartData}
                                    currency={selectedCurrency}
                                    chartType={chartType}
                                    showAverage={showAverage}
                                    showSMA={showSMA}
                                    showEMA={showEMA}
                                    showBollinger={showBollinger}
                                    average={average}
                                    smaData={smaData}
                                    emaData={emaData}
                                    bollingerData={bollingerData}
                                    chartRef={chartRef}
                                />

                                <ChartSummaryDialog
                                    open={summaryOpen}
                                    onOpenChange={setSummaryOpen}
                                    data={chartData}
                                    currency={selectedCurrency}
                                    startDate={startDate}
                                    endDate={endDate}
                                    currencies={currencies}
                                />

                                <div className="dark:bg-slate-800/50 bg-slate-200/50 rounded-lg p-4 mt-6">
                                    <h3 className="text-sm font-medium dark:text-slate-300 text-slate-600 mb-2">Interpretación</h3>
                                    <p className="text-sm dark:text-slate-400">
                                        Este gráfico muestra la evolución de la tasa de cambio en pesos cubanos (CUP) durante el período
                                        seleccionado. Un valor más alto indica que se necesitan más pesos cubanos para comprar la moneda
                                        extranjera.
                                    </p>
                                    <p className="text-sm dark:text-slate-400 text-slate-600 mt-2">
                                        <strong>Indicadores técnicos:</strong>
                                    </p>
                                    <ul className="text-sm dark:text-slate-400 text-slate-500 list-disc pl-5 mt-1 space-y-1">
                                        <li>
                                            <span className="text-amber-400 font-medium">SMA (14):</span> Media Móvil Simple de 14 períodos,
                                            útil para identificar tendencias a medio plazo.
                                        </li>
                                        <li>
                                            <span className="text-pink-400 font-medium">EMA (14):</span> Media Móvil Exponencial de 14
                                            períodos, da más peso a los datos recientes.
                                        </li>
                                        <li>
                                            <span className="text-blue-400 font-medium">Bandas de Bollinger:</span> Muestran la volatilidad
                                            del precio y posibles zonas de sobrecompra o sobreventa.
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-12 dark:text-slate-400 text-slate-600">
                                No hay datos disponibles para el rango de fechas seleccionado.
                            </div>
                        )}
                    </div>
                    <InfoDisclaimer className="mt-6" />
                </CardContent>
            </Card>
        </motion.div>
    )
}
