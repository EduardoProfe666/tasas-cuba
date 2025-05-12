"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { currencyNames } from "./chart-utils"

interface CurrencySelectorProps {
    selectedCurrency: string
    onSelectCurrency: (currency: string) => void
}

export function CurrencySelector({ selectedCurrency, onSelectCurrency }: CurrencySelectorProps) {
    const currencyIcons: Record<string, string> = {
        USD: "💵",
        TRX: "🪙",
        MLC: "💳",
        ECU: "💶",
        USDT_TRC20: "🔷",
        BTC: "₿",
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
        >
            <h3 className="text-sm font-medium text-slate-300 mb-2">Selecciona una moneda</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {Object.keys(currencyNames).map((currency) => (
                    <Button
                        key={currency}
                        variant={selectedCurrency === currency ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelectCurrency(currency)}
                        className={`flex items-center justify-center gap-2 h-auto py-3 ${
                            selectedCurrency === currency
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                        }`}
                    >
                        <span className="text-lg">{currencyIcons[currency]}</span>
                        <span>{currency}</span>
                    </Button>
                ))}
            </div>
        </motion.div>
    )
}
