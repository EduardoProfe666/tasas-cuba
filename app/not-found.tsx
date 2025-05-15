"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ghost, Home, Calculator, LineChartIcon as ChartLineUp } from "lucide-react"
import { motion } from "framer-motion"

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center w-full max-w-2xl"
            >
                <Ghost className="w-16 h-16 md:w-20 md:h-20 text-orange-500 mb-6 drop-shadow-lg" />
                <h1 className="text-3xl p-2 md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300">
                    Página no encontrada
                </h1>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 text-center max-w-xl">
                    Lo sentimos, la página que buscas no existe o fue movida.<br />
                    Puedes regresar al inicio o explorar otras secciones útiles de la aplicación.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center">
                    <Link href="/" className="flex-1">
                        <Button
                            size="lg"
                            variant="default"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-600"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Ir al inicio
                        </Button>
                    </Link>
                    <Link href="/calculadora" className="flex-1">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full border-orange-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-orange-800 text-orange-600 dark:text-orange-400"
                        >
                            <Calculator className="mr-2 h-5 w-5" />
                            Calculadora Monetaria
                        </Button>
                    </Link>
                    <Link href="/analisis-historico" className="flex-1">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full border-orange-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-orange-800 text-orange-600 dark:text-orange-400"
                        >
                            <ChartLineUp className="mr-2 h-5 w-5" />
                            Análisis histórico
                        </Button>
                    </Link>
                </div>
            </motion.div>
            <footer className="mt-12 sm:mt-16 text-center text-xs text-slate-400 dark:text-slate-500 w-full">
        <span>
          ¿Necesitas ayuda? &mdash;{" "}
            <a
                href="https://eduardoprofe666.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
            Contacta al desarrollador
          </a>
        </span>
            </footer>
        </main>
    )
}
