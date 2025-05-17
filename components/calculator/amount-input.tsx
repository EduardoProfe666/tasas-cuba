"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AmountInputProps {
    value: string
    onChange: (value: string) => void
    currency: string
}

export function AmountInput({ value, onChange, currency }: AmountInputProps) {
    const [isFocused, setIsFocused] = useState(false)

    // Manejar cambio en el input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value

        // Permitir solo números y un punto decimal
        if (!/^(\d+)?(\.\d*)?$/.test(newValue) && newValue !== "") return

        onChange(newValue)
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="amount-input" className="text-base font-medium text-slate-800 dark:text-slate-200">
                Cantidad
            </Label>
            <div className="relative">
                <Input
                    id="amount-input"
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full h-12 text-base pr-16 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg transition-all duration-200 ${
                        isFocused ? "ring-2 ring-emerald-500/30 border-emerald-500" : ""
                    }`}
                    placeholder="0"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">
                    {currency === 'ECU' ? 'EUR' : currency}
                </div>
            </div>
        </div>
    )
}
