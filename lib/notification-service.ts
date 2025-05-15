// Servicio de notificaciones para la aplicación
import type { AppConfig } from "@/types/config"
import {format, subDays} from "date-fns";
import {ExchangeRateResponse} from "@/types/exchange-rate";

export interface NotificationData {
    title: string
    body: string
    icon?: string
    badge?: string
    tag?: string
    data?: any
    actions?: NotificationAction[]
}

export interface NotificationAction {
    action: string
    title: string
    icon?: string
}

export interface RateChange {
    currency: string
    previousRate: number
    currentRate: number
    change: number
    percentChange: number
}

export class NotificationService {
    // Solicitar permiso para mostrar notificaciones
    static async requestPermission(): Promise<boolean> {
        if (!("Notification" in window)) {
            console.warn("Este navegador no soporta notificaciones")
            return false
        }

        if (Notification.permission === "granted") {
            return true
        }

        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission()
            return permission === "granted"
        }

        return false
    }

    // Mostrar una notificación
    static async showNotification(data: NotificationData): Promise<boolean> {
        const hasPermission = await this.requestPermission()

        if (!hasPermission) {
            console.warn("No hay permiso para mostrar notificaciones")
            return false
        }

        try {
            // Si el Service Worker está registrado, usar notificaciones push
            if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
                const registration = await navigator.serviceWorker.ready
                await registration.showNotification(data.title, {
                    body: data.body,
                    icon: data.icon || "/icons/icon-192x192.png",
                    badge: data.badge || "/icons/badge-72x72.png",
                    data: data.data,
                    vibrate: [200, 100, 200],
                    tag: data.tag || "tasas-cuba-notification",
                    renotify: true,
                    actions: data.actions,
                    requireInteraction: true,
                } as any)
                return true
            } else {
                // Fallback a notificaciones normales
                new Notification(data.title, {
                    body: data.body,
                    icon: data.icon || "/icons/icon-192x192.png",
                    badge: data.badge || "/icons/badge-72x72.png",
                    tag: data.tag || "tasas-cuba-notification",
                })
                return true
            }
        } catch (error) {
            console.error("Error al mostrar notificación:", error)
            return false
        }
    }

    // Verificar si es horario silencioso
    static isQuietHours(config: AppConfig): boolean {
        if (!config.notifications.quietHoursEnabled) {
            return false
        }

        const now = new Date()
        const currentHour = now.getHours()
        const currentMinutes = now.getMinutes()
        const currentTime = currentHour * 60 + currentMinutes // Convertir a minutos

        // Convertir horas de inicio y fin a minutos
        const [startHour, startMinute] = config.notifications.quietHoursStart.split(":").map(Number)
        const [endHour, endMinute] = config.notifications.quietHoursEnd.split(":").map(Number)
        const startTime = startHour * 60 + startMinute
        const endTime = endHour * 60 + endMinute

        // Comprobar si estamos en horario silencioso
        if (startTime < endTime) {
            // Caso normal: inicio antes que fin (ej: 22:00 a 07:00)
            return currentTime >= startTime && currentTime <= endTime
        } else {
            // Caso especial: inicio después que fin (ej: 22:00 a 07:00 del día siguiente)
            return currentTime >= startTime || currentTime <= endTime
        }
    }

    // Comprobar si se debe notificar un cambio según la configuración
    static shouldNotifyChange(change: RateChange, config: AppConfig): boolean {
        const { notifications } = config
        const { currencies, type } = notifications

        // Verificar si las notificaciones están habilitadas
        if (!notifications.enabled) {
            return false
        }

        // Verificar si estamos en horario silencioso
        if (this.isQuietHours(config)) {
            return false
        }

        // Verificar si la moneda está habilitada para notificaciones
        const currencyConfig = currencies[change.currency as keyof typeof currencies]
        if (!currencyConfig || !currencyConfig.enabled) {
            return false
        }

        // Verificar si el cambio supera el umbral configurado
        const absPercentChange = Math.abs(change.percentChange)
        if (absPercentChange < currencyConfig.threshold) {
            return false
        }

        // Verificar el tipo de cambio a notificar
        switch (type) {
            case "all":
                return true
            case "up":
                return change.percentChange > 0
            case "down":
                return change.percentChange < 0
            case "major":
                return absPercentChange >= currencyConfig.threshold * 1.5 // Cambios 50% mayores que el umbral
            default:
                return true
        }
    }

    // Formatear mensaje de notificación para un cambio
    static formatChangeNotification(change: RateChange): NotificationData {
        const { currency, previousRate, currentRate, percentChange } = change
        const isPositive = percentChange > 0
        const absPercentChange = Math.abs(percentChange)

        // Determinar el título según la dirección del cambio
        const title = `${currency === 'ECU' ? 'EUR' : currency}: ${isPositive ? "Subida" : "Bajada"} del ${absPercentChange.toFixed(2)}%`

        // Crear el cuerpo del mensaje
        const body = `La tasa de ${currency === 'ECU' ? 'EUR' : currency} ha ${isPositive ? "subido" : "bajado"} de ${previousRate} a ${currentRate} CUP. Toca para ver más detalles.`

        // Determinar el icono según la dirección del cambio
        const icon = isPositive ? "/icons/rate-increase.png" : "/icons/rate-decrease.png"

        // Crear acciones para la notificación
        const actions: NotificationAction[] = [
            {
                action: "view-details",
                title: "Ver detalles",
            },
            {
                action: "dismiss",
                title: "Descartar",
            },
        ]

        return {
            title,
            body,
            icon,
            tag: `rate-change-${currency === 'ECU' ? 'EUR' : currency}`,
            data: { currency, previousRate, currentRate, percentChange, timestamp: new Date().toISOString() },
            actions,
        }
    }

    // Verificar cambios en las tasas y enviar notificaciones
    static async checkRatesAndNotify(config: AppConfig): Promise<void> {
        try {
            // Obtener fecha actual formateada
            const formattedDate = format(new Date(), "yyyy-MM-dd");

            // Obtener fecha de ayer
            const formattedPreviousDate = format(subDays(new Date(), 1), "yyyy-MM-dd");

            // Construir URLs para las API

            // Obtener datos actuales y anteriores
            const response = await fetch(`/api/exchange-rates?first_date=${formattedDate}&second_date=${formattedPreviousDate}`)

            if (!response.ok) {
                throw new Error("Error al obtener datos de tasas")
            }
            const data: ExchangeRateResponse = await response.json()

            const todayData = data.firstDate
            const yesterdayData = data.secondDate

            // Verificar si hay datos disponibles
            if (todayData.length === 0 || yesterdayData.length === 0) {
                console.warn("No hay datos suficientes para comparar tasas")
                return
            }

            // Calcular cambios para cada moneda
            const changes: RateChange[] = []
            const currencies = ["USD", "ECU", "MLC", "TRX", "USDT_TRC20", "BTC"]

            for (const currency of currencies) {
                const currentRate = todayData.find(x => x.currency.code === currency)?.value ?? 1
                const previousRate = yesterdayData.find(x => x.currency.code === currency)?.value ?? 1

                if (currentRate && previousRate) {
                    const change = currentRate - previousRate
                    const percentChange = (change / previousRate) * 100

                    changes.push({
                        currency,
                        currentRate,
                        previousRate,
                        change,
                        percentChange,
                    })
                }
            }

            // Filtrar cambios que deben ser notificados
            const notifiableChanges = changes.filter((change) => this.shouldNotifyChange(change, config))

            // Enviar notificaciones para cada cambio
            for (const change of notifiableChanges) {
                const notification = this.formatChangeNotification(change)
                await this.showNotification(notification)

                // Esperar un poco entre notificaciones para no saturar
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }


            // Guardar timestamp de la última verificación
            localStorage.setItem("last-notification-check", new Date().toISOString())
        } catch (error) {
            console.error("Error al verificar cambios en tasas:", error)
        }
    }

    // Programar verificaciones periódicas según la configuración
    static scheduleChecks(config: AppConfig): void {
        // Cancelar cualquier verificación programada anteriormente
        this.cancelScheduledChecks()

        if (!config.notifications.enabled) {
            return
        }

        // Determinar intervalo según la frecuencia configurada
        let intervalMs: number
        switch (config.notifications.frequency) {
            case "hourly":
                intervalMs = 60 * 60 * 1000 // 1 hora
                break
            case "6hours":
                intervalMs = 6 * 60 * 60 * 1000 // 6 horas
                break
            case "daily":
                intervalMs = 24 * 60 * 60 * 1000 // 24 horas
                break
            case "never":
                return // No programar verificaciones
            default:
                intervalMs = 24 * 60 * 60 * 1000 // Por defecto, diario
        }
        // Programar verificación periódica
        const intervalId = window.setInterval(() => {
            this.checkRatesAndNotify(config)
        }, intervalMs)

        // Guardar ID del intervalo para poder cancelarlo después
        localStorage.setItem("notification-check-interval-id", intervalId.toString())

        // Realizar una verificación inicial
        this.checkRatesAndNotify(config)
    }

    // Cancelar verificaciones programadas
    static cancelScheduledChecks(): void {
        const intervalIdStr = localStorage.getItem("notification-check-interval-id")
        if (intervalIdStr) {
            const intervalId = Number.parseInt(intervalIdStr, 10)
            window.clearInterval(intervalId)
            localStorage.removeItem("notification-check-interval-id")
        }
    }
}
