"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useConfig } from "@/hooks/use-config"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { isPWAInstalled } = useConfig()

  useEffect(() => {
    // No mostrar si ya está instalada
    if (isPWAInstalled) {
      return
    }

    // Check if user has previously dismissed the prompt
    const hasUserDismissedPrompt = localStorage.getItem("pwaPromptDismissed") === "true"

    if (hasUserDismissedPrompt) {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent)
      // Show the install prompt after a delay
      setTimeout(() => {
        setIsVisible(true)
      }, 3000)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [isPWAInstalled])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    // Show the install prompt
    await installPrompt.prompt()

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice

    // Reset the install prompt variable
    setInstallPrompt(null)
    setIsVisible(false)

    // Track the outcome
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
      <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 z-50 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Instalar aplicación</h3>
                <button onClick={handleDismiss} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Cerrar</span>
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Instala esta aplicación en tu dispositivo para acceder rápidamente, recibir notificaciones y usarla sin
                conexión.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleDismiss}>
                  Ahora no
                </Button>
                <Button size="sm" onClick={handleInstallClick} className="gap-1">
                  <Download className="h-4 w-4" />
                  Instalar
                </Button>
              </div>
            </motion.div>
        )}
      </AnimatePresence>
  )
}
