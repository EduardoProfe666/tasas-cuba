"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowDown, ArrowUp, Minus, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react"
import {CurrencyData} from "@/types/currency-data";

interface ChartSummaryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: any[]
    currency: string
    startDate: Date
    endDate: Date,
    currencies: CurrencyData[]
}

export function ChartSummaryDialog({
                                       open,
                                       onOpenChange,
                                       data,
                                       currency,
                                       startDate,
                                       endDate,
                                       currencies
                                   }: ChartSummaryDialogProps) {
    if (!data.length) return null

    const firstValue = data[0][currency]
    const lastValue = data[data.length - 1][currency]
    const change = lastValue - firstValue
    const percentChange = (change / firstValue) * 100

    const values = data.map((item) => item[currency])
    const min = Math.min(...values)
    const max = Math.max(...values)
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length

    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
    const volatility = Math.sqrt(variance)

    const trendStrength = Math.abs(percentChange) / volatility

    const isStrongTrend = trendStrength > 1.5

    const trendDirection = percentChange > 0 ? "alcista" : percentChange < 0 ? "bajista" : "neutral"

    // Generate trend description
    let trendDescription = ""
    if (Math.abs(percentChange) < 1) {
        trendDescription = "El mercado se mantiene estable sin cambios significativos."
    } else if (percentChange > 0) {
        trendDescription = isStrongTrend
            ? "Fuerte tendencia alcista. El precio ha aumentado significativamente."
            : "Tendencia alcista moderada. El precio ha aumentado pero con volatilidad."
    } else {
        trendDescription = isStrongTrend
            ? "Fuerte tendencia bajista. El precio ha disminuido significativamente."
            : "Tendencia bajista moderada. El precio ha disminuido pero con volatilidad."
    }

    const recentDataCount = Math.min(7, Math.floor(data.length * 0.25))
    const recentData = data.slice(-recentDataCount)
    const recentFirst = recentData[0][currency]
    const recentLast = recentData[recentData.length - 1][currency]
    const recentChange = recentLast - recentFirst
    const recentPercentChange = (recentChange / recentFirst) * 100

    const momentumDifferent = Math.sign(recentChange) !== Math.sign(change)

    let momentumDescription = ""
    if (momentumDifferent) {
        momentumDescription =
            recentChange > 0
                ? "Reciente impulso alcista que contradice la tendencia general bajista."
                : "Reciente impulso bajista que contradice la tendencia general alcista."
    } else if (Math.abs(recentPercentChange) > Math.abs(percentChange) / 2) {
        momentumDescription =
            recentChange > 0
                ? "El impulso alcista se está acelerando en los últimos días."
                : "El impulso bajista se está acelerando en los últimos días."
    } else {
        momentumDescription = "El impulso reciente está en línea con la tendencia general."
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 text-slate-200 border-slate-700">
                <DialogHeader>
                    <DialogTitle className="text-xl text-slate-100">
                        Resumen de {currencies.find(x => x.code === currency)?.name || currency} ({currency === 'ECU' ? 'EUR' : currency})
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Análisis del <span className="text-emerald-400">{format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}</span> al{" "}
                        <span className="text-emerald-400">{format(endDate, "dd 'de' MMMM 'de' yyyy", {locale: es})}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Resumen principal */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-700">
                            <div className="text-sm text-slate-400">Valor inicial</div>
                            <div className="text-2xl font-bold text-slate-100">{firstValue?.toFixed(2)} CUP</div>
                            <div className="text-xs text-slate-500 mt-1">{format(startDate, "dd MMM yyyy", { locale: es })}</div>
                        </div>

                        <div className="bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-700">
                            <div className="text-sm text-slate-400">Valor final</div>
                            <div className="text-2xl font-bold text-slate-100">{lastValue?.toFixed(2)} CUP</div>
                            <div className="text-xs text-slate-500 mt-1">{format(endDate, "dd MMM yyyy", { locale: es })}</div>
                        </div>

                        <div className="bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-700">
                            <div className="text-sm text-slate-400">Variación</div>
                            <div
                                className={`text-2xl font-bold flex items-center gap-1
                ${change > 0 ? "text-rose-400" : change < 0 ? "text-emerald-400" : "text-slate-400"}`}
                            >
                                {change === 0 ? (
                                    <Minus className="h-5 w-5" />
                                ) : change > 0 ? (
                                    <ArrowUp className="h-5 w-5" />
                                ) : (
                                    <ArrowDown className="h-5 w-5" />
                                )}
                                {Math.abs(percentChange).toFixed(2)}%
                            </div>
                            <div className="text-xs text-slate-500 mt-1">{Math.abs(change).toFixed(2)} CUP</div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-700">
                        <h3 className="text-sm font-medium text-slate-300 mb-3">Estadísticas</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <div className="text-xs text-slate-400">Mínimo</div>
                                <div className="text-base font-medium text-slate-100">{min?.toFixed(0)} CUP</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400">Máximo</div>
                                <div className="text-base font-medium text-slate-100">{max?.toFixed(0)} CUP</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400">Promedio</div>
                                <div className="text-base font-medium text-slate-100">{avg?.toFixed(2)} CUP</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400">Volatilidad</div>
                                <div className="text-base font-medium text-slate-100">{volatility?.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Análisis de tendencia */}
                    <div className="bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-700">
                        <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                            {trendDirection === "alcista" ? (
                                <TrendingUp className="h-4 w-4 text-rose-400" />
                            ) : trendDirection === "bajista" ? (
                                <TrendingDown className="h-4 w-4 text-emerald-400" />
                            ) : (
                                <Minus className="h-4 w-4 text-slate-400" />
                            )}
                            Análisis de tendencia
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium
                  ${
                                        trendDirection === "alcista"
                                            ? "bg-rose-900/20 text-rose-400"
                                            : trendDirection === "bajista"
                                                ? "bg-emerald-900/20 text-emerald-400"
                                                : "bg-slate-700 text-slate-300"
                                    }`}
                                >
                                    Tendencia {trendDirection}
                                </div>

                                {isStrongTrend && (
                                    <div className="px-2 py-1 rounded-full text-xs font-medium bg-amber-900/20 text-amber-400">
                                        Tendencia fuerte
                                    </div>
                                )}
                            </div>

                            <p className="text-sm text-slate-400">{trendDescription}</p>

                            <div className="pt-2">
                                <h4 className="text-xs font-medium text-slate-300 mb-1">Impulso reciente</h4>
                                <p className="text-sm text-slate-400">{momentumDescription}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-800">
                        <div className="flex gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                            <div>
                                <h3 className="text-sm font-medium text-amber-300 mb-1">Nota importante</h3>
                                <p className="text-sm text-amber-400">
                                    Este análisis se basa en el mercado informal de divisas de Cuba. Debe tenerse
                                    en cuenta a la hora de tomar decisiones.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="bg-slate-700 hover:bg-slate-600 text-slate-200">
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
