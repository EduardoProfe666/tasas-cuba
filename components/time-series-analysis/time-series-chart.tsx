"use client"

import type React from "react"
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts"
import { motion } from "framer-motion"
import { currencyColors } from "./chart-utils"
import {ChartTooltip} from "@/components/time-series-analysis/chart-tooltip";

interface TimeSeriesChartProps {
    data: any[]
    currency: string
    chartType: "area" | "line"
    showAverage: boolean
    showSMA: boolean
    showEMA: boolean
    showBollinger: boolean
    average: number
    smaData: any[]
    emaData: any[]
    bollingerData: any[]
    chartRef: React.RefObject<any>
}

export function TimeSeriesChart({
                                    data,
                                    currency,
                                    chartType,
                                    showAverage,
                                    showSMA,
                                    showEMA,
                                    showBollinger,
                                    average,
                                    smaData,
                                    emaData,
                                    bollingerData,
                                    chartRef,
                                }: TimeSeriesChartProps) {
    const gridColor = "#334155" // slate-700
    const textColor = "#94a3b8" // slate-400

    const mainChartHeight = 400

    const mergedData = data.map((item, idx) => ({
        ...item,
        sma: smaData[idx]?.sma,
        ema: emaData[idx]?.ema,
        upperBand: bollingerData[idx].upperBand,
        lowerBand: bollingerData[idx].lowerBand,
        middleBand: bollingerData[idx].middleBand
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
        >
            <div className="w-full bg-slate-800 rounded-lg p-4 shadow-md" ref={chartRef}>
                {/* Gráfico principal */}
                <div className="mb-4">
                    <ResponsiveContainer width="100%" height={mainChartHeight}>
                        {chartType === "area" ? (
                            <AreaChart data={mergedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`color${currency}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={currencyColors[currency]?.stroke || "#10b981"} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={currencyColors[currency]?.stroke || "#10b981"} stopOpacity={0} />
                                    </linearGradient>

                                    {/* Gradient for Bollinger Bands */}
                                    <linearGradient id="bollingerGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

                                <XAxis
                                    dataKey="formattedDate"
                                    tick={{ fill: textColor }}
                                    tickMargin={10}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                />

                                <YAxis
                                    tick={{ fill: textColor }}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                    domain={["auto", "auto"]}
                                />

                                <Tooltip
                                    content={<ChartTooltip currency={currency} />}
                                />

                                {/* Bollinger Bands */}
                                {showBollinger && bollingerData.length > 0 && (
                                    <Area
                                        type="monotone"
                                        dataKey="upperBand"
                                        stroke="#3b82f6"
                                        strokeWidth={1}
                                        strokeDasharray="3 3"
                                        fillOpacity={0.2}
                                        isAnimationActive={true}
                                        fill="#3b82f6"
                                    />
                                )}
                                {showBollinger && bollingerData.length > 0 && (
                                    <Area
                                        type="monotone"
                                        dataKey="middleBand"
                                        stroke="#3b82f6"
                                        strokeWidth={1}
                                        strokeDasharray="3 3"
                                        fillOpacity={0.2}
                                        isAnimationActive={true}
                                        fill="#3b82f6"
                                    />
                                )}
                                {showBollinger && bollingerData.length > 0 && (
                                    <Area
                                        type="monotone"
                                        dataKey="lowerBand"
                                        stroke="#3b82f6"
                                        strokeWidth={1}
                                        strokeDasharray="3 3"
                                        fillOpacity={0.2}
                                        isAnimationActive={true}
                                        fill="#3b82f6"
                                    />
                                )}

                                {/* Main Area */}
                                <Area
                                    type="monotone"
                                    dataKey={currency}
                                    stroke={currencyColors[currency]?.stroke || "#10b981"}
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={`url(#color${currency})`}
                                    animationDuration={1500}
                                    animationEasing="ease-in-out"
                                />

                                {/* SMA Line */}
                                {showSMA && smaData.length > 0 && (
                                    <Area
                                        type="monotone"
                                        dataKey="sma"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={false}
                                        isAnimationActive={true}
                                        fillOpacity={0.2}
                                        fill="#f59e0b"
                                    />
                                )}

                                {/* EMA Line */}
                                {showEMA && emaData.length > 0 && (
                                    <Area
                                        type="monotone"
                                        dataKey="ema"
                                        stroke="#ec4899"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={false}
                                        isAnimationActive={true}
                                        fillOpacity={0.2}
                                        fill="#ec4899"
                                    />
                                )}

                                {/* Average Line */}
                                {showAverage && (
                                    <ReferenceLine
                                        y={average}
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        strokeDasharray="3 3"
                                        label={{
                                            value: `Promedio: ${average.toFixed(2)}`,
                                            position: "insideBottomRight",
                                            fill: "#8b5cf6",
                                            fontSize: 12,
                                        }}
                                    />
                                )}
                            </AreaChart>
                        ) : (
                            <LineChart data={mergedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

                                <XAxis
                                    dataKey="formattedDate"
                                    tick={{ fill: textColor }}
                                    tickMargin={10}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                />

                                <YAxis
                                    tick={{ fill: textColor }}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                    domain={["auto", "auto"]}
                                />

                                <Tooltip
                                    content={<ChartTooltip currency={currency} />}
                                />

                                {/* Bollinger Bands */}
                                {showBollinger && bollingerData.length > 0 && (
                                    <Line
                                        type="monotone"
                                        dataKey="upperBand"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        strokeDasharray="1 1"
                                        dot={false}
                                        activeDot={false}
                                        isAnimationActive={true}
                                    />
                                )}
                                {showBollinger && bollingerData.length > 0 && (
                                    <Line
                                        type="monotone"
                                        dataKey="middleBand"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={false}
                                        isAnimationActive={true}
                                    />
                                )}
                                {showBollinger && bollingerData.length > 0 && (
                                    <Line
                                        type="monotone"
                                        dataKey="lowerBand"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        strokeDasharray="3 3"
                                        dot={false}
                                        activeDot={false}
                                        isAnimationActive={true}
                                    />
                                )}


                                {/* Main Line */}
                                <Line
                                    type="monotone"
                                    dataKey={currency}
                                    stroke={currencyColors[currency]?.stroke || "#10b981"}
                                    strokeWidth={3}
                                    dot={{ r: 2, fill: currencyColors[currency]?.stroke || "#10b981" }}
                                    activeDot={{ r: 6, strokeWidth: 2 }}
                                    animationDuration={1500}
                                    animationEasing="ease-in-out"
                                />

                                {/* SMA Line */}
                                {showSMA && smaData.length > 0 && (
                                    <Line
                                        type="monotone"
                                        dataKey="sma"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={false}
                                        isAnimationActive={true}
                                    />
                                )}

                                {/* EMA Line */}
                                {showEMA && emaData.length > 0 && (
                                    <Line
                                        type="monotone"
                                        dataKey="ema"
                                        stroke="#ec4899"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={false}
                                        isAnimationActive={true}
                                    />
                                )}

                                {/* Average Line */}
                                {showAverage && (
                                    <ReferenceLine
                                        y={average}
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        strokeDasharray="3 3"
                                        label={{
                                            value: `Promedio: ${average.toFixed(2)}`,
                                            position: "insideBottomRight",
                                            fill: "#8b5cf6",
                                            fontSize: 12,
                                        }}
                                    />
                                )}
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    )
}
