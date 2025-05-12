"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateComparison } from "@/components/date-comparison"
import { TimeSeriesAnalysis } from "@/components/time-series-analysis"
import { TrendingUp, Scale } from "lucide-react"
import { motion } from "framer-motion"

export function HistoricalAnalysis() {
  const [activeTab, setActiveTab] = useState("graph")

  return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="graph" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Análisis Gráfico
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Comparación de Fechas
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
