"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Wifi, WifiOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineAlert() {
  const [isOnline, setIsOnline] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setShowAlert(true)
      // Hide the alert after 3 seconds
      setTimeout(() => setShowAlert(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowAlert(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showAlert) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 left-4 right-4 z-50 md:left-1/2 md:right-auto md:w-96 md:-translate-x-1/2"
      >
        <Alert variant={isOnline ? "default" : "destructive"}>
          {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          <AlertTitle>{isOnline ? "Conexión restaurada" : "Sin conexión"}</AlertTitle>
          <AlertDescription>
            {isOnline
              ? "Tu conexión a internet ha sido restaurada. Ahora puedes acceder a todos los datos actualizados."
              : "No tienes conexión a internet. Algunas funciones pueden no estar disponibles."}
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  )
}
