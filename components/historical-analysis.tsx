"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateComparison } from "@/components/date-comparison"
import { TimeSeriesAnalysis } from "@/components/time-series-analysis/time-series-analysis"
import { TrendingUp, Scale } from "lucide-react"
import { motion } from "framer-motion"

export function HistoricalAnalysis() {
  const [activeTab, setActiveTab] = useState("graph")

  return (
      <div className="space-y-8">
        <motion.div className="border-slate-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-200 dark:bg-slate-800">
              <TabsTrigger value="graph" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 rounded-md transition-all duration-200">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Análisis Gráfico</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 rounded-md transition-all duration-200">
                <Scale className="h-4 w-4" />
                <span className="hidden sm:inline">Comparación de Fechas</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="graph" className="mt-6">
              <TimeSeriesAnalysis />
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <DateComparison />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
  )
}
