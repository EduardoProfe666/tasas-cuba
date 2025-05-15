"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Clock } from "lucide-react"

interface TimeInputProps {
    label: string
    value: string
    onChange: (value: string) => void
}

export function TimeInput({ label, value, onChange }: TimeInputProps) {
    const [hours, setHours] = useState("")
    const [minutes, setMinutes] = useState("")

    // Inicializar valores desde prop
    useEffect(() => {
        if (value) {
            const [h, m] = value.split(":")
            setHours(h)
            setMinutes(m)
        }
    }, [value])

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        // Limitar a 2 dígitos y rango 00-23
        if (val.length <= 2) {
            const numVal = Number.parseInt(val || "0", 10)
            if (!isNaN(numVal) && numVal >= 0 && numVal <= 23) {
                setHours(val)
                onChange(`${val.padStart(2, "0")}:${minutes}`)
            }
        }
    }

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        // Limitar a 2 dígitos y rango 00-59
        if (val.length <= 2) {
            const numVal = Number.parseInt(val || "0", 10)
            if (!isNaN(numVal) && numVal >= 0 && numVal <= 59) {
                setMinutes(val)
                onChange(`${hours.padStart(2, "0")}:${val.padStart(2, "0")}`)
            }
        }
    }

    return (
        <div className="space-y-2">
            <Label className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                {label}
            </Label>
            <div className="flex items-center max-w-[150px]">
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={hours}
                    onChange={handleHoursChange}
                    className="w-16 text-center border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus-visible:ring-emerald-500"
                    placeholder="00"
                />
                <span className="mx-2 text-lg text-slate-500 dark:text-slate-400">:</span>
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={minutes}
                    onChange={handleMinutesChange}
                    className="w-16 text-center border-slate-200 dark:border-slate-700 dark:bg-slate-900 focus-visible:ring-emerald-500"
                    placeholder="00"
                />
            </div>
        </div>
    )
}
