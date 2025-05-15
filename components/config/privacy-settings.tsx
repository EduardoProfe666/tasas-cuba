"use client"

import {AlertDialogTrigger} from "@/components/ui/alert-dialog"

import {useConfig} from "@/hooks/use-config"
import {Switch} from "@/components/ui/switch"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {Trash2, Save, History, ShieldAlert, Loader2, Database, LayoutGrid, Settings2} from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {useState, useEffect} from "react"
import {useToast} from "@/hooks/use-toast"
import {motion} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"

// Interfaz para las estadísticas de almacenamiento
interface StorageStats {
    total: number
    categories: {
        rates: number
        history: number
        config: number
        other: number
    }
}

export function PrivacySettings() {
    const {config, updateConfig, clearStoredData} = useConfig()
    const {privacy} = config
    const {toast} = useToast()
    const [isClearing, setIsClearing] = useState(false)
    const [storageStats, setStorageStats] = useState<StorageStats>({
        total: 0,
        categories: {
            rates: 0,
            history: 0,
            config: 0,
            other: 0,
        },
    })

    // Calcular estadísticas de almacenamiento
    const calculateStorageStats = (): StorageStats => {
        try {
            let totalSize = 0
            let ratesSize = 0
            let historySize = 0
            let configSize = 0
            let otherSize = 0

            // Analizar localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i)
                if (key) {
                    const value = localStorage.getItem(key) || ""
                    const itemSize = (key.length + value.length) * 2 // UTF-16 usa 2 bytes por carácter

                    // Categorizar por prefijo
                    if (key.startsWith("rates-") || key.startsWith("currency")) {
                        ratesSize += itemSize
                        totalSize += itemSize
                    } else if (key.startsWith("historical")) {
                        historySize += itemSize
                        totalSize += itemSize
                    } else if (key === "tasas-cuba-config" || key.startsWith("theme")) {
                        configSize += itemSize
                        totalSize += itemSize
                    } else {
                        otherSize += itemSize
                    }
                }
            }

            return {
                total: totalSize,
                categories: {
                    rates: ratesSize,
                    history: historySize,
                    config: configSize,
                    other: otherSize,
                },
            }
        } catch (error) {
            console.error("Error calculando estadísticas de almacenamiento:", error)
            return {
                total: 0,
                categories: {
                    rates: 0,
                    history: 0,
                    config: 0,
                    other: 0,
                },
            }
        }
    }

    // Actualizar estadísticas al montar el componente y cuando cambie la configuración
    useEffect(() => {
        const stats = calculateStorageStats()
        setStorageStats(stats)
    }, [config])

    const handleSaveHistoryToggle = (enabled: boolean) => {
        updateConfig({
            privacy: {
                ...privacy,
                saveHistory: enabled,
            },
        })
    }

    const handleSaveOfflineDataToggle = (enabled: boolean) => {
        updateConfig({
            privacy: {
                ...privacy,
                saveOfflineData: enabled,
            },
        })
    }

    // Formatear bytes a una unidad legible
    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 bytes"

        const k = 1024
        const sizes = ["bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    // Calcular el porcentaje de una categoría respecto al total
    const calculatePercentage = (categorySize: number): number => {
        if (storageStats.total === 0) return 0
        return Math.round((categorySize / storageStats.total) * 100)
    }

    // Función para borrar datos
    const handleClearData = async () => {
        setIsClearing(true)

        try {
            // Llamar a la función de borrado
            await clearStoredData()

            // Actualizar estadísticas después del borrado
            setTimeout(() => {
                const newStats = calculateStorageStats()
                setStorageStats(newStats)
                setIsClearing(false)

                toast({
                    title: "Datos eliminados",
                    description: "Se han eliminado los datos almacenados correctamente.",
                    variant: "default",
                })
            }, 800)
        } catch (error) {
            console.error("Error al borrar datos:", error)
            setIsClearing(false)

            toast({
                title: "Error",
                description: "No se pudieron eliminar todos los datos. Inténtalo de nuevo.",
                variant: "destructive",
            })
        }
    }

    const container = {
        hidden: {opacity: 0},
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: {opacity: 0, y: 20},
        show: {opacity: 1, y: 0, transition: {duration: 0.3}},
    }

    // Colores para las categorías
    const categoryColors = {
        rates: "bg-emerald-500 dark:bg-emerald-600",
        history: "bg-blue-500 dark:bg-blue-600",
        config: "bg-amber-500 dark:bg-amber-600",
        other: "bg-slate-500 dark:bg-slate-600",
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-emerald-600 dark:text-emerald-400"/>
                    Privacidad y Almacenamiento
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Gestiona cómo se almacenan tus datos en este dispositivo.
                </p>
            </div>

            {/* Estadísticas detalladas de almacenamiento */}
            <motion.div variants={item}>
                <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Database className="h-4 w-4 text-emerald-500 dark:text-emerald-400"/>
                            Uso de almacenamiento
                        </CardTitle>
                        <CardDescription>Espacio utilizado por la aplicación en este dispositivo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Total de almacenamiento */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total utilizado:</span>
                                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {formatBytes(storageStats.total)}
                </span>
                            </div>

                            {/* Visualización gráfica */}
                            <div className="flex h-4 w-full rounded-full overflow-hidden">
                                {storageStats.total > 0 ? (
                                    <>
                                        <div
                                            className={`${categoryColors.rates} transition-all duration-300`}
                                            style={{width: `${calculatePercentage(storageStats.categories.rates)}%`}}
                                        />
                                        <div
                                            className={`${categoryColors.history} transition-all duration-300`}
                                            style={{width: `${calculatePercentage(storageStats.categories.history)}%`}}
                                        />
                                        <div
                                            className={`${categoryColors.config} transition-all duration-300`}
                                            style={{width: `${calculatePercentage(storageStats.categories.config)}%`}}
                                        />
                                        <div
                                            className={`${categoryColors.other} transition-all duration-300`}
                                            style={{width: `${calculatePercentage(storageStats.categories.other)}%`}}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full bg-slate-200 dark:bg-slate-700"/>
                                )}
                            </div>

                            {/* Desglose por categorías */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                <div
                                    className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-3 h-3 rounded-full ${categoryColors.rates}`}></div>
                                        <span
                                            className="text-xs font-medium text-slate-700 dark:text-slate-300">Tasas</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatBytes(storageStats.categories.rates)}
                    </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                      {calculatePercentage(storageStats.categories.rates)}%
                    </span>
                                    </div>
                                </div>

                                <div
                                    className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-3 h-3 rounded-full ${categoryColors.history}`}></div>
                                        <span
                                            className="text-xs font-medium text-slate-700 dark:text-slate-300">Historial</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatBytes(storageStats.categories.history)}
                    </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                      {calculatePercentage(storageStats.categories.history)}%
                    </span>
                                    </div>
                                </div>

                                <div
                                    className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-3 h-3 rounded-full ${categoryColors.config}`}></div>
                                        <span
                                            className="text-xs font-medium text-slate-700 dark:text-slate-300">Configuración</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatBytes(storageStats.categories.config)}
                    </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                      {calculatePercentage(storageStats.categories.config)}%
                    </span>
                                    </div>
                                </div>

                                <div
                                    className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-3 h-3 rounded-full ${categoryColors.other}`}></div>
                                        <span
                                            className="text-xs font-medium text-slate-700 dark:text-slate-300">Otros</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formatBytes(storageStats.categories.other)}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {privacy.saveHistory && (
                                    <Badge
                                        variant="outline"
                                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                    >
                                        <History className="h-3 w-3 mr-1"/> Historial activado
                                    </Badge>
                                )}
                                {privacy.saveOfflineData && (
                                    <Badge
                                        variant="outline"
                                        className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                    >
                                        <LayoutGrid className="h-3 w-3 mr-1"/> Datos offline activados
                                    </Badge>
                                )}
                                <Badge variant="outline"
                                       className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    <Settings2 className="h-3 w-3 mr-1"/> Configuración
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item} className="space-y-4">
                <div
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="space-y-0.5">
                        <Label
                            htmlFor="save-history"
                            className="font-medium flex items-center gap-2 text-slate-800 dark:text-slate-200"
                        >
                            <History className="h-4 w-4 text-emerald-600 dark:text-emerald-400"/>
                            Guardar historial
                        </Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Almacenar historial de consultas para acceso rápido
                        </p>
                    </div>
                    <Switch
                        id="save-history"
                        checked={privacy.saveHistory}
                        onCheckedChange={handleSaveHistoryToggle}
                        className="data-[state=checked]:bg-emerald-600"
                    />
                </div>

                <div
                    className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="space-y-0.5">
                        <Label
                            htmlFor="save-offline"
                            className="font-medium flex items-center gap-2 text-slate-800 dark:text-slate-200"
                        >
                            <Save className="h-4 w-4 text-emerald-600 dark:text-emerald-400"/>
                            Datos sin conexión
                        </Label>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Guardar datos para uso sin conexión a
                            internet</p>
                    </div>
                    <Switch
                        id="save-offline"
                        checked={privacy.saveOfflineData}
                        onCheckedChange={handleSaveOfflineDataToggle}
                        className="data-[state=checked]:bg-emerald-600"
                    />
                </div>
            </motion.div>

            <motion.div variants={item} className="pt-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="w-full gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700"
                        >
                            <Trash2 className="h-4 w-4"/>
                            Borrar datos almacenados
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-slate-200 dark:border-slate-700">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-slate-800 dark:text-slate-200">¿Estás
                                seguro?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                                Esta acción eliminará todos los datos almacenados localmente, incluyendo el historial de
                                consultas y los
                                datos guardados para uso sin conexión. Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="py-2">
                            <div className="flex flex-col space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Datos a eliminar:</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                    {formatBytes(
                        storageStats.categories.rates + storageStats.categories.history,
                    )}
                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    La configuración de la aplicación se mantendrá.
                                </p>
                            </div>
                        </div>

                        <AlertDialogFooter>
                            <AlertDialogCancel
                                className="border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleClearData}
                                disabled={isClearing}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isClearing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                        Borrando...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 mr-2"/>
                                        Borrar datos
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </motion.div>

            <motion.div variants={item}>
                <div
                    className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">Información sobre
                        privacidad</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Todos tus datos se almacenan localmente en tu dispositivo. No recopilamos ni enviamos
                        información personal a
                        servidores externos. Puedes borrar todos los datos almacenados en cualquier momento.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}
