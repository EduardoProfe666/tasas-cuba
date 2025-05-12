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

interface TimeSeriesChartProps {
    data: any[]
    currency: string
    chartType: "area" | "line"
    showAverage: boolean
    showSMA: boolean
    showEMA: boolean
    showBollinger: boolean
    showRSI: boolean
    showMACD: boolean
    showStochastic: boolean
    average: number
    smaData: any[]
    emaData: any[]
    bollingerData: any[]
    rsiData: any[]
    macdData: any[]
    stochasticData: any[]
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
                                    showRSI,
                                    showMACD,
                                    showStochastic,
                                    average,
                                    smaData,
                                    emaData,
                                    bollingerData,
                                    rsiData,
                                    macdData,
                                    stochasticData,
                                    chartRef,
                                }: TimeSeriesChartProps) {
    const gridColor = "#334155" // slate-700
    const textColor = "#94a3b8" // slate-400
    const backgroundColor = "#1e293b" // slate-800

    const showAdditionalIndicators = showRSI || showMACD || showStochastic

    const mainChartHeight = showAdditionalIndicators ? 300 : 400

    const indicatorHeight = 100

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
                            <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                                    formatter={(value: number) => [`${value.toFixed(2)} CUP`, currency]}
                                    labelFormatter={(label) => `Fecha: ${label}`}
                                    contentStyle={{
                                        backgroundColor: backgroundColor,
                                        borderColor: "#475569",
                                        borderRadius: "0.375rem",
                                        color: "#e2e8f0",
                                    }}
                                    itemStyle={{ color: "#e2e8f0" }}
                                    cursor={{ stroke: "#64748b", strokeWidth: 1, strokeDasharray: "5 5" }}
                                />

                                {/* Bollinger Bands */}
                                {showBollinger && bollingerData.length > 0 && (
                                    <>
                                        <Area
                                            type="monotone"
                                            dataKey="upperBand"
                                            data={bollingerData}
                                            stroke="#3b82f6"
                                            strokeWidth={1}
                                            strokeDasharray="3 3"
                                            fillOpacity={0}
                                            isAnimationActive={true}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="lowerBand"
                                            data={bollingerData}
                                            stroke="#3b82f6"
                                            strokeWidth={1}
                                            strokeDasharray="3 3"
                                            fillOpacity={0}
                                            isAnimationActive={true}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="upperBand"
                                            data={bollingerData}
                                            stroke="none"
                                            fill="url(#bollingerGradient)"
                                            fillOpacity={1}
                                            isAnimationActive={true}
                                            baseValue={(dataPoint: any) => dataPoint.lowerBand}
                                        />
                                    </>
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
                                    <Line
                                        type="monotone"
                                        dataKey="sma"
                                        data={smaData}
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
                                        data={emaData}
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
                            </AreaChart>
                        ) : (
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                                    formatter={(value: number) => [`${value.toFixed(2)} CUP`, currency]}
                                    labelFormatter={(label) => `Fecha: ${label}`}
                                    contentStyle={{
                                        backgroundColor: backgroundColor,
                                        borderColor: "#475569",
                                        borderRadius: "0.375rem",
                                        color: "#e2e8f0",
                                    }}
                                    itemStyle={{ color: "#e2e8f0" }}
                                    cursor={{ stroke: "#64748b", strokeWidth: 1, strokeDasharray: "5 5" }}
                                />

                                {/* Bollinger Bands */}
                                {showBollinger && bollingerData.length > 0 && (
                                    <>
                                        <Line
                                            type="monotone"
                                            dataKey="upperBand"
                                            data={bollingerData}
                                            stroke="#3b82f6"
                                            strokeWidth={1}
                                            strokeDasharray="3 3"
                                            dot={false}
                                            activeDot={false}
                                            isAnimationActive={true}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="middleBand"
                                            data={bollingerData}
                                            stroke="#3b82f6"
                                            strokeWidth={1}
                                            dot={false}
                                            activeDot={false}
                                            isAnimationActive={true}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="lowerBand"
                                            data={bollingerData}
                                            stroke="#3b82f6"
                                            strokeWidth={1}
                                            strokeDasharray="3 3"
                                            dot={false}
                                            activeDot={false}
                                            isAnimationActive={true}
                                        />
                                    </>
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
                                        data={smaData}
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
                                        data={emaData}
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

                {/* Indicadores adicionales */}
                {showRSI && rsiData.length > 0 && (
                    <div className="mb-4">
                        <div className="text-xs text-slate-400 mb-1">RSI (14)</div>
                        <ResponsiveContainer width="100%" height={indicatorHeight}>
                            <LineChart data={rsiData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis
                                    dataKey="formattedDate"
                                    tick={{ fill: textColor }}
                                    tickMargin={10}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                    height={20}
                                    tickFormatter={() => ""}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fill: textColor }}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`${value.toFixed(2)}`, "RSI"]}
                                    labelFormatter={(label) => `Fecha: ${label}`}
                                    contentStyle={{
                                        backgroundColor: backgroundColor,
                                        borderColor: "#475569",
                                        borderRadius: "0.375rem",
                                        color: "#e2e8f0",
                                    }}
                                    itemStyle={{ color: "#e2e8f0" }}
                                />
                                <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                                <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="rsi" stroke="#a855f7" dot={false} isAnimationActive={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {showMACD && macdData.length > 0 && (
                    <div className="mb-4">
                        <div className="text-xs text-slate-400 mb-1">MACD (12,26,9)</div>
                        <ResponsiveContainer width="100%" height={indicatorHeight}>
                            <LineChart data={macdData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis
                                    dataKey="formattedDate"
                                    tick={{ fill: textColor }}
                                    tickMargin={10}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                    height={20}
                                    tickFormatter={() => ""}
                                />
                                <YAxis tick={{ fill: textColor }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
                                <Tooltip
                                    formatter={(value: number) => [`${value.toFixed(4)}`, ""]}
                                    labelFormatter={(label) => `Fecha: ${label}`}
                                    contentStyle={{
                                        backgroundColor: backgroundColor,
                                        borderColor: "#475569",
                                        borderRadius: "0.375rem",
                                        color: "#e2e8f0",
                                    }}
                                    itemStyle={{ color: "#e2e8f0" }}
                                />
                                <ReferenceLine y={0} stroke="#64748b" />
                                <Line type="monotone" dataKey="macd" stroke="#3b82f6" dot={false} isAnimationActive={true} />
                                <Line type="monotone" dataKey="signal" stroke="#f97316" dot={false} isAnimationActive={true} />
                                <Area
                                    type="monotone"
                                    dataKey="histogram"
                                    fill="#10b981"
                                    stroke="#10b981"
                                    fillOpacity={0.5}
                                    isAnimationActive={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {showStochastic && stochasticData.length > 0 && (
                    <div>
                        <div className="text-xs text-slate-400 mb-1">Estocástico (14,3)</div>
                        <ResponsiveContainer width="100%" height={indicatorHeight}>
                            <LineChart data={stochasticData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                <XAxis
                                    dataKey="formattedDate"
                                    tick={{ fill: textColor }}
                                    tickMargin={10}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                    height={20}
                                    tickFormatter={() => ""}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    tick={{ fill: textColor }}
                                    axisLine={{ stroke: gridColor }}
                                    tickLine={{ stroke: gridColor }}
                                />
                                <Tooltip
                                    formatter={(value: number) => [`${value.toFixed(2)}`, ""]}
                                    labelFormatter={(label) => `Fecha: ${label}`}
                                    contentStyle={{
                                        backgroundColor: backgroundColor,
                                        borderColor: "#475569",
                                        borderRadius: "0.375rem",
                                        color: "#e2e8f0",
                                    }}
                                    itemStyle={{ color: "#e2e8f0" }}
                                />
                                <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" />
                                <ReferenceLine y={20} stroke="#10b981" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="k" stroke="#ec4899" dot={false} isAnimationActive={true} />
                                <Line type="monotone" dataKey="d" stroke="#f59e0b" dot={false} isAnimationActive={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
