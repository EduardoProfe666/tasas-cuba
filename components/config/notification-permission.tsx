"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useConfig } from "@/hooks/use-config"
import { NotificationService } from "@/lib/notification-service"
import { useToast } from "@/hooks/use-toast"

export function NotificationPermission() {
    const [permissionState, setPermissionState] = useState<NotificationPermission>("default")
    const [isVisible, setIsVisible] = useState(false)
    const { config, updateConfig } = useConfig()
    const { toast } = useToast()

    useEffect(() => {
        // Solo mostrar si la app está instalada como PWA y las notificaciones están habilitadas en la configuración
        if (!window.matchMedia("(display-mode: standalone)").matches && !(window.navigator as any).standalone) {
            return
        }

        // Verificar si ya se ha solicitado permiso
        if (Notification.permission !== "default") {
            setPermissionState(Notification.permission)
            return
        }

        // Verificar si el usuario ha desestimado el prompt anteriormente
        const hasPromptBeenShown = localStorage.getItem("notification-permission-prompt-shown")
        if (hasPromptBeenShown) {
            return
        }

        // Mostrar el prompt después de un tiempo
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    const handleRequestPermission = async () => {
        try {
            const granted = await NotificationService.requestPermission()
            setPermissionState(granted ? "granted" : "denied")

            // Actualizar configuración si se concede permiso
            if (granted) {
                updateConfig({
                    notifications: {
                        ...config.notifications,
                        enabled: true,
                    },
                })

                // Programar verificaciones de tasas
                NotificationService.scheduleChecks(config)

                toast({
                    title: "Notificaciones activadas",
                    description: "Recibirás alertas sobre cambios importantes en las tasas.",
                })

                // Enviar notificación de prueba
                await NotificationService.showNotification({
                    title: "Notificaciones activadas",
                    body: "Recibirás alertas cuando haya cambios significativos en las tasas de cambio.",
                    icon: "/icons/icon-192x192.png",
                })
            }
        } catch (error) {
            console.error("Error al solicitar permiso:", error)
            toast({
                title: "Error",
                description: "No se pudo activar las notificaciones. Inténtalo de nuevo.",
                variant: "destructive",
            })
        } finally {
            // Marcar que el prompt ha sido mostrado
            localStorage.setItem("notification-permission-prompt-shown", "true")
            setIsVisible(false)
        }
    }

    const handleDismiss = () => {
        localStorage.setItem("notification-permission-prompt-shown", "true")
        setIsVisible(false)
    }

    if (!isVisible || permissionState !== "default") {
        return null
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-24 md:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 z-50 border border-slate-200 dark:border-slate-700"
            >
                <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                        <Bell className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-1">Activar notificaciones</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            Recibe alertas cuando las tasas de cambio tengan variaciones significativas.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                                onClick={handleRequestPermission}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                            >
                                <Bell className="h-4 w-4" />
                                Activar
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleDismiss}
                                className="w-full border-slate-200 dark:border-slate-700 gap-2"
                            >
                                <BellOff className="h-4 w-4" />
                                Ahora no
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
