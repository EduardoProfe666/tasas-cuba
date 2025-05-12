"use client"

import { useState, useEffect } from "react"
import { X, Monitor, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

interface MobileAlertProps {
    pageKey?: string
}

export function MobileAlert({ pageKey = "default" }: MobileAlertProps) {
    const [isVisible, setIsVisible] = useState(false)
    const { toast } = useToast()
    const isMobile = useMobile()

    useEffect(() => {
        if (!isMobile) return

        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 1500)

        return () => clearTimeout(timer)
    }, [isMobile, pageKey])

    const handleDismiss = () => {
        setIsVisible(false)
    }
    useEffect(() => {
        if (isMobile && window.innerWidth < 360) {
            const alertShown = localStorage.getItem(`mobile-alert-shown-${pageKey}`)

            if (!alertShown) {
                toast({
                    title: "Mejor experiencia en desktop",
                    description: "Esta página está optimizada para visualización en pantallas más grandes.",
                    duration: 5000,
                })
                localStorage.setItem(`mobile-alert-shown-${pageKey}`, "true")
            }
        }
    }, [isMobile, pageKey, toast])

    if (!isMobile || !isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
            >
                <div className="bg-amber-950 border border-amber-800 rounded-lg shadow-lg p-4 text-amber-200">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-medium text-amber-200 flex items-center gap-1.5">
                                    <Monitor className="h-4 w-4" />
                                    Mejor experiencia en desktop
                                </h3>
                                <button onClick={handleDismiss} className="text-amber-400 hover:text-amber-300 transition-colors">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Cerrar</span>
                                </button>
                            </div>
                            <p className="text-sm mt-1 text-amber-300">
                                Esta página está optimizada para visualización en pantallas más grandes. Algunos gráficos e indicadores
                                pueden ser difíciles de ver en dispositivos móviles.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
