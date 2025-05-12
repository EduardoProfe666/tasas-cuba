"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { BarChart3, LineChart, Activity, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChartExport } from "./chart-export"

interface ChartControlsProps {
    chartType: "area" | "line"
    setChartType: (type: "area" | "line") => void
    showAverage: boolean
    setShowAverage: (show: boolean) => void
    showSMA: boolean
    setShowSMA: (show: boolean) => void
    showEMA: boolean
    setShowEMA: (show: boolean) => void
    showBollinger: boolean
    setShowBollinger: (show: boolean) => void
    showRSI: boolean
    setShowRSI: (show: boolean) => void
    showMACD: boolean
    setShowMACD: (show: boolean) => void
    showStochastic: boolean
    setShowStochastic: (show: boolean) => void
    onShowSummary: () => void
    chartRef: React.RefObject<HTMLDivElement | null>
    currency: string
    startDate: Date
    endDate: Date
}

export function ChartControls({
                                  chartType,
                                  setChartType,
                                  showAverage,
                                  setShowAverage,
                                  showSMA,
                                  setShowSMA,
                                  showEMA,
                                  setShowEMA,
                                  showBollinger,
                                  setShowBollinger,
                                  showRSI,
                                  setShowRSI,
                                  showMACD,
                                  setShowMACD,
                                  showStochastic,
                                  setShowStochastic,
                                  onShowSummary,
                                  chartRef,
                                  currency,
                                  startDate,
                                  endDate,
                              }: ChartControlsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col space-y-4"
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-2">Tipo de gráfico</h3>
                    <Tabs
                        value={chartType}
                        onValueChange={(value) => setChartType(value as "area" | "line")}
                        className="w-[260px]"
                    >
                        <TabsList className="grid grid-cols-2 bg-slate-800">
                            <TabsTrigger value="area" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
                                <BarChart3 className="h-4 w-4" />
                                Área
                            </TabsTrigger>
                            <TabsTrigger value="line" className="flex items-center gap-2 data-[state=active]:bg-slate-700">
                                <LineChart className="h-4 w-4" />
                                Línea
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex gap-2">
                    <ChartExport chartRef={chartRef} currency={currency} startDate={startDate} endDate={endDate} />

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onShowSummary}
                        className="flex items-center gap-2 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-300"
                    >
                        <Info className="h-4 w-4" />
                        Ver resumen
                    </Button>
                </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Indicadores técnicos
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch id="average" checked={showAverage} onCheckedChange={setShowAverage} />
                        <Label htmlFor="average" className="cursor-pointer text-slate-300">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      Promedio
                      <Info className="h-3 w-3 text-slate-400" />
                    </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs text-xs">
                                            Muestra el valor promedio de la tasa de cambio durante el período seleccionado.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="sma" checked={showSMA} onCheckedChange={setShowSMA} />
                        <Label htmlFor="sma" className="cursor-pointer text-slate-300">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      SMA (14)
                      <Info className="h-3 w-3 text-slate-400" />
                    </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs text-xs">
                                            Media Móvil Simple de 14 períodos. Suaviza las fluctuaciones de precios para identificar
                                            tendencias.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="ema" checked={showEMA} onCheckedChange={setShowEMA} />
                        <Label htmlFor="ema" className="cursor-pointer text-slate-300">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      EMA (14)
                      <Info className="h-3 w-3 text-slate-400" />
                    </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs text-xs">
                                            Media Móvil Exponencial de 14 períodos. Da más peso a los datos recientes que la SMA.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="bollinger" checked={showBollinger} onCheckedChange={setShowBollinger} />
                        <Label htmlFor="bollinger" className="cursor-pointer text-slate-300">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                    <span className="flex items-center gap-1">
                      Bandas Bollinger
                      <Info className="h-3 w-3 text-slate-400" />
                    </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs text-xs">
                                            Bandas que muestran la volatilidad del precio. Útiles para identificar sobrecompra o sobreventa.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </Label>
                    </div>
                </div>

                <div className="mt-4 border-t border-slate-700 pt-4">
                    <h4 className="text-xs font-medium text-slate-400 mb-3">Indicadores avanzados</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch id="rsi" checked={showRSI} onCheckedChange={setShowRSI} />
                            <Label htmlFor="rsi" className="cursor-pointer text-slate-300">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                      <span className="flex items-center gap-1">
                        RSI (14)
                        <Info className="h-3 w-3 text-slate-400" />
                      </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs text-xs">
                                                Índice de Fuerza Relativa. Mide la velocidad y el cambio de los movimientos de precios.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="macd" checked={showMACD} onCheckedChange={setShowMACD} />
                            <Label htmlFor="macd" className="cursor-pointer text-slate-300">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                      <span className="flex items-center gap-1">
                        MACD
                        <Info className="h-3 w-3 text-slate-400" />
                      </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs text-xs">
                                                Convergencia/Divergencia de Medias Móviles. Muestra la relación entre dos medias móviles.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="stochastic" checked={showStochastic} onCheckedChange={setShowStochastic} />
                            <Label htmlFor="stochastic" className="cursor-pointer text-slate-300">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                      <span className="flex items-center gap-1">
                        Estocástico
                        <Info className="h-3 w-3 text-slate-400" />
                      </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs text-xs">
                                                Oscilador estocástico. Compara el precio de cierre con el rango de precios durante un período.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
