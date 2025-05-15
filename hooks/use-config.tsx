"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { type AppConfig, DEFAULT_CONFIG } from "@/types/config"
import { NotificationService } from "@/lib/notification-service"

const CONFIG_STORAGE_KEY = "tasas-cuba-config"

interface ConfigContextType {
    config: AppConfig
    updateConfig: (newConfig: Partial<AppConfig>) => void
    resetConfig: () => void
    clearStoredData: () => Promise<boolean>
    isPWAInstalled: boolean
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG)
    const [isPWAInstalled, setIsPWAInstalled] = useState(false)

    // Cargar configuración al inicio
    useEffect(() => {
        const loadConfig = () => {
            try {
                const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY)
                if (storedConfig) {
                    const parsedConfig = JSON.parse(storedConfig) as AppConfig
                    setConfig(parsedConfig)
                }
            } catch (error) {
                console.error("Error loading config:", error)
                // Si hay un error, usar la configuración por defecto
                setConfig(DEFAULT_CONFIG)
            }
        }

        // Detectar si la aplicación está instalada como PWA
        const checkPWAStatus = () => {
            setIsPWAInstalled(window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true)
        }

        loadConfig()
        checkPWAStatus()

        // Escuchar cambios en el modo de visualización (para detectar instalación de PWA)
        const mediaQuery = window.matchMedia("(display-mode: standalone)")
        const handleChange = (e: MediaQueryListEvent) => {
            setIsPWAInstalled(e.matches)
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    // Configurar notificaciones cuando cambie la configuración
    useEffect(() => {
        // Solo configurar notificaciones si la app está instalada como PWA
        if (!isPWAInstalled && config.notifications.enabled) {
            // Programar verificaciones de tasas según la configuración
            NotificationService.scheduleChecks(config)
        } else {
            // Cancelar verificaciones programadas si las notificaciones están desactivadas
            NotificationService.cancelScheduledChecks()
        }
    }, [config.notifications.enabled, isPWAInstalled, config])

    // Guardar configuración cuando cambie
    useEffect(() => {
        try {
            localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
        } catch (error) {
            console.error("Error saving config:", error)
        }
    }, [config])

    const updateConfig = (newConfig: Partial<AppConfig>) => {
        setConfig((prevConfig) => {
            const updatedConfig = {
                ...prevConfig,
                ...newConfig,
                lastUpdated: new Date().toISOString(),
            }
            return updatedConfig
        })
    }

    const resetConfig = () => {
        setConfig(DEFAULT_CONFIG)
    }

    // Mejorar la función clearStoredData para que sea más completa y devuelva una promesa
    const clearStoredData = async (): Promise<boolean> => {
        return new Promise((resolve) => {
            try {
                // Guarda la configuración actual
                const currentConfig = localStorage.getItem(CONFIG_STORAGE_KEY)

                // Recolecta las claves a borrar
                const keysToDelete: string[] = []
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    if (
                        key &&
                        (
                            key.startsWith("rates-") ||
                            key.startsWith("currency") ||
                            key.startsWith("historical") ||
                            key === "tasas-cuba-config" ||
                            key.startsWith("theme")
                        )
                    ) {
                        keysToDelete.push(key)
                    }
                }

                // Borra todas las claves seleccionadas, excepto la config (la restauramos después)
                keysToDelete.forEach((key) => {
                    if (key !== CONFIG_STORAGE_KEY) {
                        localStorage.removeItem(key)
                    }
                })

                // Restaura la config si la guardaste antes
                if (currentConfig) {
                    localStorage.setItem(CONFIG_STORAGE_KEY, currentConfig)
                }

                // Limpia caches de la app si corresponde
                if ("caches" in window) {
                    caches.keys().then((cacheNames) => {
                        cacheNames.forEach((cacheName) => {
                            if (cacheName.includes("tasas-cuba")) {
                                caches.delete(cacheName)
                            }
                        })
                    })
                }

                setTimeout(() => {
                    resolve(true)
                }, 500)
            } catch (error) {
                console.error("Error clearing stored data:", error)
                resolve(false)
            }
        })
    }


    return (
        <ConfigContext.Provider
            value={{
                config,
                updateConfig,
                resetConfig,
                clearStoredData,
                isPWAInstalled,
            }}
        >
            {children}
        </ConfigContext.Provider>
    )
}

export function useConfig() {
    const context = useContext(ConfigContext)
    if (context === undefined) {
        throw new Error("useConfig must be used within a ConfigProvider")
    }
    return context
}
