"use client"

import { AlertTriangle, ExternalLink, Info } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface InfoDisclaimerProps {
  variant?: "compact" | "full"
  className?: string
}

export function InfoDisclaimer({ variant = "full", className = "" }: InfoDisclaimerProps) {
  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip supportMobileTap delayDuration={0}>
          <TooltipTrigger asChild>
            <button type="button" aria-label="Información sobre la fuente de las tasas de cambio"
              className={`inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 cursor-help ${className}`}
            >
              <Info className="h-4 w-4" />
              <span className="text-xs select-none">Fuente: elToque</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm">
              Estas tasas de cambio son proporcionadas por elToque y corresponden al mercado informal de divisas, no a
              la tasa oficial de Cuba.
            </p>
            <a
              href="https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 mt-2 text-amber-600 dark:text-amber-400 hover:underline"
            >
              Más información <ExternalLink className="h-3 w-3" />
            </a>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Información importante</h4>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Estas tasas de cambio son proporcionadas por elToque y corresponden al mercado informal de divisas, no a la
            tasa oficial de Cuba.
          </p>
          <a
            href="https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs inline-flex items-center gap-1 mt-2 text-amber-600 dark:text-amber-500 hover:underline"
          >
            Más información <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
