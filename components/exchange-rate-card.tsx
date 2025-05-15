"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowDown, ArrowUp, HelpCircle, Minus, TrendingDown, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import {useState} from "react";

interface ExchangeRateCardProps {
  currency: string
  currencyName: string
  icon: string
  currentRate: number
  previousRate: number
  change: number
  percentChange: number
}

export function ExchangeRateCard({
  currency,
  currencyName,
  icon,
  currentRate,
  previousRate,
  change,
  percentChange,
}: ExchangeRateCardProps) {
  const isPositive = change > 0
  const isNeutral = change === 0

  const getChangeColor = () => {
    if (isNeutral) return "text-slate-500 dark:text-slate-400"
    return isPositive ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
  }

  const getChangeBackgroundColor = () => {
    if (isNeutral) return "bg-slate-100 dark:bg-slate-700"
    return isPositive ? "bg-rose-50 dark:bg-rose-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"
  }

  const getChangeIcon = () => {
    if (isNeutral) return <Minus className="h-3 w-3" />
    return isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const getTrendIcon = () => {
    if (isNeutral) return <Minus className="h-5 w-5" />
    return isPositive ? (
      <TrendingUp className="h-5 w-5 text-rose-500 dark:text-rose-400" />
    ) : (
      <TrendingDown className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden dark:bg-slate-800 shadow-lg border-slate-200 dark:border-slate-700  transition-all duration-200 hover:shadow-2xl">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-600 text-2xl">
                {icon}
              </div>
              <div>
                <CardTitle className="text-xl flex items-center gap-2">{currency === "ECU" ? "EUR" : currency}</CardTitle>
                <CardDescription>{currencyName}</CardDescription>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip supportMobileTap delayDuration={0}>
                <TooltipTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Más información</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="max-w-xs">
                    Tasa de cambio: 1 {currency === 'ECU' ? 'EUR' : currency} = {currentRate} CUP
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{currentRate}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">CUP</span>
              </div>
              {getTrendIcon()}
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()} ${getChangeBackgroundColor()}`}
              >
                {getChangeIcon()}
                <span>{Math.abs(change).toFixed(2)}</span>
              </div>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor()} ${getChangeBackgroundColor()}`}
              >
                {getChangeIcon()}
                <span>{Math.abs(percentChange).toFixed(2)}%</span>
              </div>

              <span className="text-xs text-slate-500 dark:text-slate-400">vs. día anterior</span>
            </div>

            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between">
              <span>Día anterior:</span>
              <span className="font-medium">{previousRate} CUP</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
