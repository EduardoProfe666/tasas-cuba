"use client"

import { ConversionCard } from "./conversion-card"
import { motion } from "framer-motion"
import {ExchangeRateData} from "@/types/exchange-rate";

interface ConversionResultsProps {
    baseCurrency: string
    amount: number
    rates: ExchangeRateData[]
    getEffectiveRate: (currency: string) => number
}

export function ConversionResults({ baseCurrency, amount, rates, getEffectiveRate }: ConversionResultsProps) {
    // Ordenar las monedas: CUP primero, luego el resto alfabéticamente
    const sortedCurrencies = rates.map(x => x.currency.code)
        .filter((currency) => currency !== baseCurrency)
        .sort((a, b) => {
            if (a === "CUP") return -1
            if (b === "CUP") return 1
            return a.localeCompare(b)
        })

    // Calcular el valor convertido
    const calculateConvertedValue = (targetCurrency: string): number => {
        if (baseCurrency === "CUP") {
            // De CUP a otra moneda: dividir por la tasa de la moneda destino
            const targetRate = getEffectiveRate(targetCurrency)
            return targetRate > 0 ? amount / targetRate : 0
        } else if (targetCurrency === "CUP") {
            // De otra moneda a CUP: multiplicar por la tasa de la moneda base
            const baseRate = getEffectiveRate(baseCurrency)
            return amount * baseRate
        } else {
            // De una moneda a otra (a través de CUP)
            const baseRate = getEffectiveRate(baseCurrency)
            const targetRate = getEffectiveRate(targetCurrency)

            if (baseRate <= 0 || targetRate <= 0) return 0

            // Primero convertir a CUP, luego a la moneda destino
            const amountInCUP = amount * baseRate
            return amountInCUP / targetRate
        }
    }

    // Calcular la tasa de conversión entre monedas
    const calculateExchangeRate = (targetCurrency: string): number => {
        if (baseCurrency === "CUP") {
            // De CUP a otra moneda: 1/tasa de la moneda destino
            const targetRate = getEffectiveRate(targetCurrency)
            return targetRate > 0 ? 1 / targetRate : 0
        } else if (targetCurrency === "CUP") {
            // De otra moneda a CUP: tasa de la moneda base
            return getEffectiveRate(baseCurrency)
        } else {
            // De una moneda a otra
            const baseRate = getEffectiveRate(baseCurrency)
            const targetRate = getEffectiveRate(targetCurrency)

            if (baseRate <= 0 || targetRate <= 0) return 0

            // Tasa de conversión: baseRate / targetRate
            return baseRate / targetRate
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {sortedCurrencies.map((currency) => (
                <ConversionCard
                    key={currency}
                    currency={currency}
                    baseCurrency={baseCurrency}
                    convertedValue={calculateConvertedValue(currency)}
                    exchangeRate={calculateExchangeRate(currency)}
                />
            ))}
        </motion.div>
    )
}
