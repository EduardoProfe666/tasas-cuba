"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {Copy, Check, ArrowRightLeft} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface ConversionCardProps {
    currency: string
    baseCurrency: string
    convertedValue: number
    exchangeRate: number
}

const currencyNames: Record<string, string> = {
    USD: "Dólar Estadounidense",
    TRX: "Tron",
    MLC: "Moneda Libremente Convertible",
    ECU: "Euro",
    USDT_TRC20: "Tether (USDT)",
    BTC: "Bitcoin",
    CUP: "Peso Cubano",
}

const currencyIcons: Record<string, string> = {
    USD: "💵",
    TRX: "🪙",
    MLC: "💳",
    ECU: "💶",
    USDT_TRC20: "🔷",
    BTC: "₿",
    CUP: "🇨🇺",
}

export function ConversionCard({ currency, baseCurrency, convertedValue, exchangeRate }: ConversionCardProps) {
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    const numberFormatter = new Intl.NumberFormat('en-US');

    // Formatear el valor convertido según la moneda
    const formatValue = (value: number): string => {
       return numberFormatter.format(value)
    }

    // Formatear la tasa de cambio
    const formatExchangeRate = (): string => {
        return numberFormatter.format(exchangeRate)
    }

    // Copiar el resultado al portapapeles
    const handleCopy = () => {
        const textToCopy = `${formatValue(convertedValue)} ${currency}`

        navigator.clipboard.writeText(textToCopy).then(
            () => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)

                toast({
                    title: "Copiado al portapapeles",
                    description: textToCopy,
                })
            },
            (err) => {
                console.error("Error al copiar:", err)
                toast({
                    title: "Error al copiar",
                    description: "No se pudo copiar al portapapeles",
                    variant: "destructive",
                })
            },
        )
    }

    // Texto para la tasa de cambio
    const getExchangeRateText = (): string => {
        return `1 ${baseCurrency === 'ECU' ? 'EUR' : baseCurrency} = ${formatExchangeRate()} ${currency === 'ECU' ? 'EUR' : currency}`
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }

    return (
        <motion.div variants={item} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden border-slate-200 dark:border-slate-700 transition-all duration-200 hover:shadow-lg h-full bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/90">
                <CardContent className="p-0">
                    <div className="p-4 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-2xl shadow-sm">
                                {currencyIcons[currency] || "💱"}
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-800 dark:text-slate-200">{currency === 'ECU' ? 'EUR' : currency}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{currencyNames[currency] || currency}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                {formatValue(convertedValue)}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="h-6 w-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    {copied ? (
                                        <Check className="h-3 w-3 text-amber-500" />
                                    ) : (
                                        <Copy className="h-3 w-3 text-slate-400" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500 dark:text-slate-400">{getExchangeRateText()}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
