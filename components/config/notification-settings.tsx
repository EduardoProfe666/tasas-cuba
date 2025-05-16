"use client"

import { useConfig } from "@/hooks/use-config"
import type { NotificationFrequency, NotificationType } from "@/types/config"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {Clock, ArrowUpDown, BellOff, Bell, AlertTriangle, CheckCircle2, BellRing, Paintbrush} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TimeInput } from "./time-input"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { NotificationService } from "@/lib/notification-service"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

export function NotificationSettings() {
    const { config, updateConfig, isPWAInstalled } = useConfig()
    const { notifications } = config
    const { toast } = useToast()
    const [permissionState, setPermissionState] = useState<NotificationPermission>("default")
    const [isTestingNotification, setIsTestingNotification] = useState(false)

    // Verificar el estado del permiso de notificaciones
    useEffect(() => {
        if ("Notification" in window) {
            setPermissionState(Notification.permission)
        }
    }, [])

    const handleToggleNotifications = async (enabled: boolean) => {
        // Si se está activando y no hay permiso, solicitarlo
        if (enabled && permissionState !== "granted") {
            const granted = await NotificationService.requestPermission()
            setPermissionState(granted ? "granted" : "denied")

            if (!granted) {
                toast({
                    title: "Permiso denegado",
                    description: "No se pueden activar las notificaciones sin tu permiso.",
                    variant: "destructive",
                })
                return
            }
        }

        // Actualizar configuración
        updateConfig({
            notifications: {
                ...notifications,
                enabled,
            },
        })

        // Programar o cancelar verificaciones según corresponda
        if (enabled) {
            NotificationService.scheduleChecks({
                ...config,
                notifications: {
                    ...notifications,
                    enabled: true,
                },
            })

            toast({
                title: "Notificaciones activadas",
                description: "Recibirás alertas sobre cambios importantes en las tasas.",
            })
        } else {
            NotificationService.cancelScheduledChecks()

            toast({
                title: "Notificaciones desactivadas",
                description: "Ya no recibirás alertas sobre cambios en las tasas.",
            })
        }
    }

    const handleCurrencyToggle = (currency: keyof typeof notifications.currencies, enabled: boolean) => {
        updateConfig({
            notifications: {
                ...notifications,
                currencies: {
                    ...notifications.currencies,
                    [currency]: {
                        ...notifications.currencies[currency],
                        enabled,
                    },
                },
            },
        })
    }

    const handleThresholdChange = (currency: keyof typeof notifications.currencies, threshold: number) => {
        updateConfig({
            notifications: {
                ...notifications,
                currencies: {
                    ...notifications.currencies,
                    [currency]: {
                        ...notifications.currencies[currency],
                        threshold,
                    },
                },
            },
        })
    }

    const handleFrequencyChange = (frequency: NotificationFrequency) => {
        updateConfig({
            notifications: {
                ...notifications,
                frequency,
            },
        })

        // Reprogramar verificaciones con la nueva frecuencia
        if (notifications.enabled) {
            NotificationService.cancelScheduledChecks()
            NotificationService.scheduleChecks({
                ...config,
                notifications: {
                    ...notifications,
                    frequency,
                },
            })
        }
    }

    const handleTypeChange = (type: NotificationType) => {
        updateConfig({
            notifications: {
                ...notifications,
                type,
            },
        })
    }

    const handleQuietHoursToggle = (enabled: boolean) => {
        updateConfig({
            notifications: {
                ...notifications,
                quietHoursEnabled: enabled,
            },
        })
    }

    const handleQuietHoursStartChange = (time: string) => {
        updateConfig({
            notifications: {
                ...notifications,
                quietHoursStart: time,
            },
        })
    }

    const handleQuietHoursEndChange = (time: string) => {
        updateConfig({
            notifications: {
                ...notifications,
                quietHoursEnd: time,
            },
        })
    }

    const handleTestNotification = async () => {
        setIsTestingNotification(true)

        try {
            const success = await NotificationService.showNotification({
                title: "Notificación de prueba",
                body: "Esta es una notificación de prueba para verificar que todo funciona correctamente.",
                icon: "/icons/icon-192x192.png",
                actions: [
                    {
                        action: "view-details",
                        title: "Ver detalles",
                    },
                    {
                        action: "dismiss",
                        title: "Descartar",
                    },
                ],
            })

            if (success) {
                toast({
                    title: "Notificación enviada",
                    description: "La notificación de prueba se ha enviado correctamente.",
                })
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo enviar la notificación de prueba.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error al enviar notificación de prueba:", error)
            toast({
                title: "Error",
                description: "Ocurrió un error al enviar la notificación de prueba.",
                variant: "destructive",
            })
        } finally {
            setIsTestingNotification(false)
        }
    }

    const currencyNames = {
        USD: "Dólar Estadounidense",
        ECU: "Euro",
        MLC: "Moneda Libremente Convertible",
        TRX: "Tron",
        USDT_TRC20: "Tether (USDT)",
        BTC: "Bitcoin",
    }

    const currencyIcons = {
        USD: "💵",
        ECU: "💶",
        MLC: "💳",
        TRX: "🪙",
        USDT_TRC20: "🔷",
        BTC: "₿",
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    }

    if (!isPWAInstalled) {
        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <BellRing className="h-5 w-5 text-orange-600 dark:text-orange-400"/>
                        Notificaciones
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Configura las alertas de cambios en las tasas de cambio.
                    </p>
                </div>

                <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                    <AlertTitle className="text-amber-800 dark:text-amber-300 font-medium">
                        Instala la aplicación para recibir notificaciones
                    </AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-400">
                        Las notificaciones solo están disponibles cuando instalas la aplicación como PWA en tu dispositivo. Busca el
                        botón de instalación en la barra de direcciones de tu navegador o espera a que aparezca el prompt de
                        instalación.
                    </AlertDescription>
                </Alert>

                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                        <Bell className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        Beneficios de las notificaciones
                    </h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 ml-6 list-disc">
                        <li>Recibe alertas cuando las tasas cambien significativamente</li>
                        <li>Mantente informado sin necesidad de abrir la aplicación constantemente</li>
                        <li>Configura qué monedas te interesan y cuándo quieres recibir alertas</li>
                        <li>Personaliza el umbral de cambio para cada moneda</li>
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Notificaciones
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Configura las alertas de cambios en las tasas de cambio.
                </p>
            </div>

            {permissionState === "denied" && (
                <Alert className="bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300">
                    <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-500" />
                    <AlertTitle className="text-rose-800 dark:text-rose-300 font-medium">
                        Permiso de notificaciones bloqueado
                    </AlertTitle>
                    <AlertDescription className="text-rose-700 dark:text-rose-400">
                        Has bloqueado los permisos de notificaciones para esta aplicación. Para recibir alertas, debes permitir las
                        notificaciones en la configuración de tu navegador.
                    </AlertDescription>
                </Alert>
            )}

            {permissionState === "granted" && notifications.enabled && (
                <Alert className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                    <AlertTitle className="text-emerald-800 dark:text-emerald-300 font-medium">
                        Notificaciones activadas
                    </AlertTitle>
                    <AlertDescription className="text-emerald-700 dark:text-emerald-400">
                        Recibirás alertas cuando haya cambios significativos en las tasas de cambio según tu configuración.
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="space-y-0.5">
                    <Label htmlFor="notifications-toggle" className="font-medium text-slate-800 dark:text-slate-200">
                        Activar notificaciones
                    </Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Recibe alertas sobre cambios en las tasas de cambio
                    </p>
                </div>
                <Switch
                    id="notifications-toggle"
                    checked={notifications.enabled}
                    onCheckedChange={handleToggleNotifications}
                    className="data-[state=checked]:bg-orange-600"
                    disabled={permissionState === "denied"}
                />
            </div>

            {notifications.enabled && permissionState === "granted" && (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6 rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50"
                >
                    <motion.div variants={item} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h4 className="text-base font-medium text-slate-800 dark:text-slate-200">Monedas a seguir</h4>
                            <Badge
                                variant="outline"
                                className="text-xs bg-emerald-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                            >
                                {Object.values(notifications.currencies).filter((c) => c.enabled).length} seleccionadas
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(notifications.currencies).map(([currency, settings], index) => (
                                <motion.div
                                    key={currency}
                                    variants={item}
                                    custom={index}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <Card className="overflow-hidden dark:bg-slate-900 h-full border-slate-200 dark:border-slate-700 transition-all duration-200 hover:shadow-md">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-xl">
                                                        {currencyIcons[currency as keyof typeof currencyIcons]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-800 dark:text-slate-200">{currency === 'ECU' ? 'EUR' : currency}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[120px] truncate">
                                                            {currencyNames[currency as keyof typeof currencyNames]}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={settings.enabled}
                                                    onCheckedChange={(checked) =>
                                                        handleCurrencyToggle(currency as keyof typeof notifications.currencies, checked)
                                                    }
                                                    className="data-[state=checked]:bg-amber-600"
                                                />
                                            </div>

                                            {settings.enabled && (
                                                <div className="mt-4 space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <Label
                                                            htmlFor={`threshold-${currency}`}
                                                            className="text-xs text-slate-600 dark:text-slate-400"
                                                        >
                                                            Umbral de cambio:{" "}
                                                            <span className="font-medium text-amber-600 dark:text-orange-400">
                                {settings.threshold}%
                              </span>
                                                        </Label>
                                                    </div>
                                                    <Slider
                                                        id={`threshold-${currency}`}
                                                        min={1}
                                                        max={10}
                                                        step={1}
                                                        value={[settings.threshold]}
                                                        onValueChange={(value) =>
                                                            handleThresholdChange(currency as keyof typeof notifications.currencies, value[0])
                                                        }
                                                        className="[&>span:not(:last-child)]:bg-amber-600"
                                                    />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        Notificar cuando el cambio sea ≥ {settings.threshold}%
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <Separator className="bg-slate-200 dark:bg-slate-700" />

                    <motion.div variants={item} className="space-y-4">
                        <h4 className="text-base font-medium text-slate-800 dark:text-slate-200">
                            Configuración de notificaciones
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <Label
                                    htmlFor="notification-frequency"
                                    className="flex items-center gap-2 text-slate-800 dark:text-slate-200"
                                >
                                    <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    Frecuencia
                                </Label>
                                <Select
                                    value={notifications.frequency}
                                    onValueChange={(value) => handleFrequencyChange(value as NotificationFrequency)}
                                >
                                    <SelectTrigger id="notification-frequency" className="border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                                        <SelectValue placeholder="Selecciona frecuencia" />
                                    </SelectTrigger>
                                    <SelectContent className="border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                                        <SelectItem value="hourly">Cada hora</SelectItem>
                                        <SelectItem value="6hours">Cada 6 horas</SelectItem>
                                        <SelectItem value="daily">Una vez al día</SelectItem>
                                        <SelectItem value="never">Nunca</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Determina cada cuánto tiempo se verifican cambios
                                </p>
                            </div>

                            <div className="space-y-2 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <Label
                                    htmlFor="notification-type"
                                    className="flex items-center gap-2 text-slate-800 dark:text-slate-200"
                                >
                                    <ArrowUpDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                    Tipo de cambios
                                </Label>
                                <Select
                                    value={notifications.type}
                                    onValueChange={(value) => handleTypeChange(value as NotificationType)}
                                >
                                    <SelectTrigger id="notification-type" className="border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                                        <SelectValue placeholder="Selecciona tipo" />
                                    </SelectTrigger>
                                    <SelectContent className="border-slate-200 dark:bg-slate-900 dark:border-slate-700">
                                        <SelectItem value="major">Solo cambios grandes</SelectItem>
                                        <SelectItem value="all">Todos los cambios</SelectItem>
                                        <SelectItem value="up">Solo alzas</SelectItem>
                                        <SelectItem value="down">Solo bajas</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Filtra qué tipo de cambios te interesan
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <Separator className="bg-slate-200 dark:bg-slate-700" />

                    <motion.div variants={item} className="space-y-4">
                        <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="space-y-0.5">
                                <Label
                                    htmlFor="quiet-hours-toggle"
                                    className="font-medium flex items-center gap-2 text-slate-800 dark:text-slate-200"
                                >
                                    <BellOff className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                                    Horario silencioso
                                </Label>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    No recibir notificaciones durante ciertas horas
                                </p>
                            </div>
                            <Switch
                                id="quiet-hours-toggle"
                                checked={notifications.quietHoursEnabled}
                                onCheckedChange={handleQuietHoursToggle}
                                className="data-[state=checked]:bg-amber-600"
                            />
                        </div>

                        {notifications.quietHoursEnabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                            >
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <TimeInput
                                        label="Desde"
                                        value={notifications.quietHoursStart}
                                        onChange={handleQuietHoursStartChange}
                                    />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <TimeInput label="Hasta" value={notifications.quietHoursEnd} onChange={handleQuietHoursEndChange} />
                                </div>
                                <div className="md:col-span-2 text-xs text-slate-500 dark:text-slate-400 italic">
                                    No recibirás notificaciones entre las {notifications.quietHoursStart} y las{" "}
                                    {notifications.quietHoursEnd} horas.
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <Separator className="bg-slate-200 dark:bg-slate-700" />

                    <motion.div variants={item} className="pt-2">
                        <Button
                            onClick={handleTestNotification}
                            disabled={isTestingNotification || permissionState !== "granted"}
                            className="w-full gap-2 bg-amber-600 hover:bg-amber-700"
                        >
                            {isTestingNotification ? (
                                <>
                                    <Bell className="h-4 w-4 animate-pulse" />
                                    Enviando notificación...
                                </>
                            ) : (
                                <>
                                    <Bell className="h-4 w-4" />
                                    Enviar notificación de prueba
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                            Envía una notificación de prueba para verificar que todo funciona correctamente.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}
