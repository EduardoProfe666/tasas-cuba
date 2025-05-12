"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CurrencyData } from "@/types/currency-data"

interface CurrencySelectorProps {
    selectedCurrency: string
    onSelectCurrency: (currency: string) => void
    currencies: CurrencyData[]
}

export function CurrencySelector({ selectedCurrency, onSelectCurrency, currencies }: CurrencySelectorProps) {
    const currencyOrder = ["USD", "ECU", "MLC", "TRX", "USDT_TRC20", "BTC"]
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
        >
            <h3 className="text-sm font-medium text-slate-300 mb-2">Selecciona una moneda</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                <TooltipProvider>
                    {currencyOrder.map((c) => {
                        const currency = currencies.find(x => x.code === c);
                        return (
                        <Tooltip key={currency?.code ?? c}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={selectedCurrency === (currency?.code ?? c) ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onSelectCurrency((currency?.code ?? c))}
                                    className={`flex items-center justify-center gap-2 h-auto py-3 ${
                                        selectedCurrency === (currency?.code ?? c)
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                            : "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                                    }`}
                                >
                                    <span className="text-lg">{currency?.icon ?? '💱'}</span>
                                    <span>{currency?.code === 'ECU' ? 'EUR' : currency?.code ?? c}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>{currency?.name ?? c}</span>
                            </TooltipContent>
                        </Tooltip>
                    )})}
                </TooltipProvider>
            </div>
        </motion.div>
    )
}
