import { format } from "date-fns"
import { es } from "date-fns/locale"

interface ChartTooltipProps {
    active?: boolean
    payload?: any[]
    label?: string
    currency: string
}

export function ChartTooltip({ active, payload, label, currency }: ChartTooltipProps) {
    if (!active || !payload || !payload.length) return null

    let formattedDate = label
    if (payload && payload.length > 0 && payload[0].payload) {
        formattedDate = payload[0].payload.displayDate
    }

    const mainValue = payload.find((p) => p.dataKey === currency)?.value

    const sma = payload.find((p) => p.dataKey === "sma")?.value
    const ema = payload.find((p) => p.dataKey === "ema")?.value
    const upperBand = payload.find((p) => p.dataKey === "upperBand")?.value
    const middleBand = payload.find((p) => p.dataKey === "middleBand")?.value
    const lowerBand = payload.find((p) => p.dataKey === "lowerBand")?.value

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3 text-sm">
            <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">{formattedDate}</div>

            <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-600 dark:text-slate-400">{currency === 'ECU' ? 'EUR' : currency}:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{mainValue?.toFixed(0)} CUP</span>
                </div>

                {sma !== undefined && sma !== null && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-amber-600 dark:text-amber-400">SMA:</span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">{sma?.toFixed(2)} CUP</span>
                    </div>
                )}

                {ema !== undefined && ema !== null && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-pink-600 dark:text-pink-400">EMA:</span>
                        <span className="font-medium text-pink-600 dark:text-pink-400">{ema?.toFixed(2)} CUP</span>
                    </div>
                )}

                {upperBand !== undefined && upperBand !== null && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-blue-600 dark:text-blue-400">Banda Superior:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{upperBand?.toFixed(2)} CUP</span>
                    </div>
                )}

                {middleBand !== undefined && middleBand !== null && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-blue-600 dark:text-blue-400">Banda Media:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{middleBand?.toFixed(2)} CUP</span>
                    </div>
                )}

                {lowerBand !== undefined && lowerBand !== null && (
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-blue-600 dark:text-blue-400">Banda Inferior:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">{lowerBand?.toFixed(2)} CUP</span>
                    </div>
                )}
            </div>
        </div>
    )
}
