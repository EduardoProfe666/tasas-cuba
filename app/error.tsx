"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface ErrorProps {
    error: Error
    reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center w-full max-w-2xl"
            >
                <AlertCircle className="w-16 h-16 md:w-20 md:h-20 text-red-500 mb-6 drop-shadow-lg" />
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-500 dark:from-red-400 dark:to-pink-400">
                    ¡Ups! Algo salió mal
                </h1>
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 text-center max-w-xl">
                    Lo sentimos, ocurrió un error inesperado.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link href="/" className="flex-1">
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                        >
                            <Home className="mr-2 h-5 w-5" />
                            Ir al inicio
                        </Button>
                    </Link>
                </div>

                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-6 text-sm text-red-500 underline hover:text-red-700"
                >
                    {showDetails ? "Ocultar detalles" : "Mostrar detalles del error"}
                </button>

                {showDetails && (
                    <pre className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-300 rounded max-w-full overflow-auto whitespace-pre-wrap break-words">
            {error.message || "---"}
          </pre>
                )}
            </motion.div>

            <footer className="mt-12 sm:mt-16 text-center text-xs text-slate-400 dark:text-slate-500 w-full">
        <span>
          ¿Necesitas ayuda? &mdash;{" "}
            <a
                href="https://eduardoprofe666.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 dark:text-red-400 hover:underline font-medium"
            >
            Contacta al desarrollador
          </a>
        </span>
            </footer>
        </main>
    )
}
