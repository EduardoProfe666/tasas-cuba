"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { es } from "date-fns/locale"
import { InfoDisclaimer } from "@/components/info-disclaimer"
import { motion } from "framer-motion"
import { TimeSeriesChart } from "./time-series-chart"
import { ChartControls } from "./chart-controls"
import { ChartSummaryDialog } from "./chart-summary-dialog"
import { CurrencySelector } from "./currency-selector"
import { TimeRangeSelector } from "./time-range-selector"
import {
    getCurrencyBaseValue,
    getCurrencyVolatility,
    calculateSMA,
    calculateEMA,
    calculateBollingerBands,
    calculateRSI,
    calculateMACD,
    calculateStochastic,
} from "./chart-utils"

// Datos mockeados para el gráfico
const generateMockData = (startDate: Date, endDate: Date, currency: string) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const baseValue = getCurrencyBaseValue(currency)
    const volatility = getCurrencyVolatility(currency)
    const trend = Math.random() > 0.5 ? 0.2 : -0.2 // Tendencia alcista o bajista

    let previousValue = baseValue

    return days.map((day, index) => {
        // Generar un valor aleatorio con tendencia y volatilidad
        const randomFactor = (Math.random() - 0.5) * volatility
        const trendFactor = (trend * index) / days.length
        let value = previousValue * (1 + randomFactor + trendFactor)

        // Asegurar que el valor no sea negativo y tenga 2 decimales
        value = Math.max(value, baseValue * 0.7)
        value = Number.parseFloat(value.toFixed(2))

        previousValue = value

        return {
            date: format(day, "yyyy-MM-dd"),
            [currency]: value,
            formattedDate: format(day, "dd MMM", { locale: es }),
        }
    })
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
    const [showRSI, setShowRSI] = useState(false)
    const [showMACD, setShowMACD] = useState(false)
    const [showStochastic, setShowStochastic] = useState(false)
    const [summaryOpen, setSummaryOpen] = useState(false)

    const [smaData, setSmaData] = useState<any[]>([])
    const [emaData, setEmaData] = useState<any[]>([])
    const [bollingerData, setBollingerData] = useState<any[]>([])
    const [rsiData, setRsiData] = useState<any[]>([])
    const [macdData, setMacdData] = useState<any[]>([])
    const [stochasticData, setStochasticData] = useState<any[]>([])

    const chartRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setLoading(true)

        // Simular carga de datos
        setTimeout(() => {
            const data = generateMockData(startDate, endDate, selectedCurrency)
            setChartData(data)

            const smaResult = calculateSMA(data, selectedCurrency, 14)
            const emaResult = calculateEMA(data, selectedCurrency, 14)
            const bollingerResult = calculateBollingerBands(data, selectedCurrency, 20, 2)
            const rsiResult = calculateRSI(data, selectedCurrency, 14)
            const macdResult = calculateMACD(data, selectedCurrency, 12, 26, 9)
            const stochasticResult = calculateStochastic(data, selectedCurrency, 14, 3)

            setSmaData(smaResult)
            setEmaData(emaResult)
            setBollingerData(bollingerResult)
            setRsiData(rsiResult)
            setMacdData(macdResult)
            setStochasticData(stochasticResult)

            setLoading(false)
        }, 800)
    }, [startDate, endDate, selectedCurrency])

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
            <Card className="bg-slate-900 border-slate-800 text-slate-200">
                <CardHeader>
                    <CardTitle>Análisis Histórico de Tasas de Cambio</CardTitle>
                    <CardDescription className="text-slate-400">
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

                        <CurrencySelector selectedCurrency={selectedCurrency} onSelectCurrency={setSelectedCurrency} />

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
                            showRSI={showRSI}
                            setShowRSI={setShowRSI}
                            showMACD={showMACD}
                            setShowMACD={setShowMACD}
                            showStochastic={showStochastic}
                            setShowStochastic={setShowStochastic}
                            onShowSummary={() => setSummaryOpen(true)}
                            chartRef={chartRef}
                            currency={selectedCurrency}
                            startDate={startDate}
                            endDate={endDate}
                        />

                        {loading ? (
                            <div className="w-full h-[400px]">
                                <Skeleton className="w-full h-full rounded-lg bg-slate-800" />
                            </div>
                        ) : chartData.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <Card className="bg-slate-800 border-slate-700">
                                        <CardContent className="p-4">
                                            <div className="text-sm text-slate-400">Valor Mínimo</div>
                                            <div className="text-2xl font-bold text-slate-100">{min} CUP</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-slate-800 border-slate-700">
                                        <CardContent className="p-4">
                                            <div className="text-sm text-slate-400">Valor Máximo</div>
                                            <div className="text-2xl font-bold text-slate-100">{max} CUP</div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-slate-800 border-slate-700">
                                        <CardContent className="p-4">
                                            <div className="text-sm text-slate-400">Variación</div>
                                            <div
                                                className={`text-2xl font-bold ${percentChange >= 0 ? "text-emerald-400" : "text-rose-400"}`}
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
                                    showRSI={showRSI}
                                    showMACD={showMACD}
                                    showStochastic={showStochastic}
                                    average={average}
                                    smaData={smaData}
                                    emaData={emaData}
                                    bollingerData={bollingerData}
                                    rsiData={rsiData}
                                    macdData={macdData}
                                    stochasticData={stochasticData}
                                    chartRef={chartRef}
                                />

                                <ChartSummaryDialog
                                    open={summaryOpen}
                                    onOpenChange={setSummaryOpen}
                                    data={chartData}
                                    currency={selectedCurrency}
                                    startDate={startDate}
                                    endDate={endDate}
                                />

                                <div className="bg-slate-800/50 rounded-lg p-4 mt-6">
                                    <h3 className="text-sm font-medium text-slate-300 mb-2">Interpretación</h3>
                                    <p className="text-sm text-slate-400">
                                        Este gráfico muestra la evolución de la tasa de cambio en pesos cubanos (CUP) durante el período
                                        seleccionado. Un valor más alto indica que se necesitan más pesos cubanos para comprar la moneda
                                        extranjera.
                                    </p>
                                    <p className="text-sm text-slate-400 mt-2">
                                        <strong>Indicadores técnicos:</strong>
                                    </p>
                                    <ul className="text-sm text-slate-400 list-disc pl-5 mt-1 space-y-1">
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
                                        <li>
                                            <span className="text-purple-400 font-medium">RSI (14):</span> Índice de Fuerza Relativa, mide la
                                            velocidad y magnitud de los movimientos direccionales de los precios.
                                        </li>
                                        <li>
                                            <span className="text-blue-400 font-medium">MACD:</span> Convergencia/Divergencia de Medias
                                            Móviles, muestra la relación entre dos medias móviles del precio.
                                        </li>
                                        <li>
                                            <span className="text-orange-400 font-medium">Estocástico:</span> Compara el precio de cierre con
                                            el rango de precios durante un período determinado.
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
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
