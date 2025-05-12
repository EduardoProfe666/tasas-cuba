import { HistoricalAnalysis } from "@/components/historical-analysis"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Comparación de Fechas | Tasas de Cambio - Peso Cubano",
  description: "Compara las tasas de cambio del peso cubano entre diferentes fechas para analizar las variaciones.",
}

export default function HistoricalAnalysisPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a inicio
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-800 dark:text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
            Análisis Histórico
          </h1>
        </header>

        <HistoricalAnalysis />

        <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-8">
          <p>
            Desarrollado por{" "}
            <a
              href="https://eduardoprofe666.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              EduardoProfe666🎩
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
