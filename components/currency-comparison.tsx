"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import { motion } from "framer-motion"
import { DataExport } from "@/components/data-export"
import { InfoDisclaimer } from "@/components/info-disclaimer"
import {ExchangeRateData} from "@/types/exchange-rate";

interface CurrencyComparisonProps {
  data1: ExchangeRateData[]
  data2: ExchangeRateData[]
  date1: Date
  date2: Date
}

export function CurrencyComparison({ data1, data2, date1, date2 }: CurrencyComparisonProps) {
  const currencyOrder = ["USD", "ECU", "MLC", "TRX", "USDT_TRC20", "BTC"]

  const getChangeColor = (change: number) => {
    if (change === 0) return "text-slate-500 dark:text-slate-400"
    return change > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
  }

  const getChangeBackgroundColor = (change: number) => {
    if (change === 0) return "bg-slate-100 dark:bg-slate-700"
    return change > 0 ? "bg-rose-50 dark:bg-rose-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"
  }

  const getChangeIcon = (change: number) => {
    if (change === 0) return <Minus className="h-3 w-3" />
    return change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const formatTime = (hours: number, minutes: number) => {
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <InfoDisclaimer variant="compact" />
        <DataExport data1={data1} data2={data2} date1={date1} date2={date2} elementId="comparison-table" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            {format(date1, "dd 'de' MMMM 'de' yyyy", { locale: es })}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Hora de actualización: {formatTime(new Date().getHours(), new Date().getMinutes())}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
            {format(date2, "dd 'de' MMMM 'de' yyyy", { locale: es })}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Hora de actualización: {formatTime(new Date().getHours(), new Date().getMinutes())}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg" id="comparison-table">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">Moneda</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                {format(date1, "dd/MM/yyyy", { locale: es })}
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                {format(date2, "dd/MM/yyyy", { locale: es })}
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                Diferencia
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                Cambio (%)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {currencyOrder.map((currency) => {
              const er1 = data1.find(x => x.currency.code === currency)
              const er2 = data2.find(x => x.currency.code === currency)
              const rate1 = er1?.value || er2?.value || 1
              const rate2 = er2?.value || 1
              const difference = rate2 - rate1
              const percentChange = (difference / rate1) * 100

              return (
                <motion.tr
                  key={currency}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-xl">
                        {er1?.currency?.icon || er2?.currency?.icon || '💱'}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">{currency === 'ECU' ? 'EUR' : currency}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {er1?.currency?.name || er2?.currency?.name || currency}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-slate-800 dark:text-slate-200">{rate1} CUP</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-800 dark:text-slate-200">{rate2} CUP</td>
                  <td className="px-4 py-4 text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor(
                        difference,
                      )} ${getChangeBackgroundColor(difference)}`}
                    >
                      {getChangeIcon(difference)}
                      <span>{Math.abs(difference).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getChangeColor(
                        difference,
                      )} ${getChangeBackgroundColor(difference)}`}
                    >
                      {getChangeIcon(difference)}
                      <span>{Math.abs(percentChange).toFixed(2)}%</span>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Interpretación</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Un valor positivo indica un aumento en la tasa de cambio, lo que significa que se necesitan más pesos cubanos
          (CUP) para comprar la moneda extranjera. Un valor negativo indica una disminución en la tasa de cambio, lo que
          significa que se necesitan menos pesos cubanos.
        </p>
      </div>
    </div>
  )
}
