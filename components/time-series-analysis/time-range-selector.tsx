"use client"

import { DatePicker } from "@/components/ui/date-picker"
import { Button } from "@/components/ui/button"
import { es } from "date-fns/locale"
import { subDays, subMonths, subYears } from "date-fns"
import { motion } from "framer-motion"

interface TimeRangeSelectorProps {
    startDate: Date
    endDate: Date
    onSelectStartDate: (date: Date | undefined) => void
    onSelectEndDate: (date: Date | undefined) => void
}

export function TimeRangeSelector({ startDate, endDate, onSelectStartDate, onSelectEndDate }: TimeRangeSelectorProps) {
    const today = new Date()

    const setPresetRange = (range: "1w" | "1m" | "3m" | "6m" | "1y" | "all") => {
        let newStartDate: Date

        switch (range) {
            case "1w":
                newStartDate = subDays(today, 7)
                break
            case "1m":
                newStartDate = subMonths(today, 1)
                break
            case "3m":
                newStartDate = subMonths(today, 3)
                break
            case "6m":
                newStartDate = subMonths(today, 6)
                break
            case "1y":
                newStartDate = subYears(today, 1)
                break
            case "all":
                newStartDate = new Date(2021,0,1)
                break
            default:
                newStartDate = subMonths(today, 1)
        }

        onSelectStartDate(newStartDate)
        onSelectEndDate(today)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetRange("1w")}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                    1 semana
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetRange("1m")}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                    1 mes
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetRange("3m")}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                    3 meses
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetRange("6m")}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                    6 meses
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetRange("1y")}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                    1 año
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetRange("all")}
                    className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                >
                    Todo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de inicio</label>
                    <DatePicker minDate={new Date(2021,1,1)} maxDate={endDate} date={startDate} onSelect={onSelectStartDate} locale={es} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de fin</label>
                    <DatePicker minDate={startDate} maxDate={new Date()} date={endDate} onSelect={onSelectEndDate} locale={es} />
                </div>
            </div>
        </motion.div>
    )
}
