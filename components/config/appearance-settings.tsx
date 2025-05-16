"use client"

import { useTheme } from "next-themes"
import { useConfig } from "@/hooks/use-config"
import type { ThemeMode } from "@/types/config"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {Sun, Moon, Monitor, ShieldAlert, BellRing, Paintbrush} from "lucide-react"
import { motion } from "framer-motion"

export function AppearanceSettings() {
    const { theme: themeMode, setTheme } = useTheme()
    const { config, updateConfig } = useConfig()

    const handleThemeChange = (value: ThemeMode) => {
        setTheme(value)
        updateConfig({ theme: value })
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.3,
            },
        }),
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Paintbrush className="h-5 w-5 text-orange-600 dark:text-orange-400"/>
                    Apariencia
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Personaliza el aspecto visual de la aplicación según tus preferencias.
                </p>
            </div>

            <RadioGroup
                value={themeMode as ThemeMode}
                onValueChange={handleThemeChange}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
                <motion.div className="h-full" custom={0} variants={itemVariants} initial="hidden" animate="visible">
                    <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
                    <Label
                        htmlFor="theme-light"
                        className="flex h-full flex-col items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 peer-data-[state=checked]:border-orange-500 dark:peer-data-[state=checked]:border-orange-500 [&:has([data-state=checked])]:border-orange-500 dark:[&:has([data-state=checked])]:border-orange-500 cursor-pointer transition-all duration-200"
                    >
                        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 p-3 mb-3">
                            <Sun className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">Modo Claro</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
              Ideal para uso diurno con buena iluminación
            </span>
                    </Label>
                </motion.div>

                <motion.div className="h-full" custom={1} variants={itemVariants} initial="hidden" animate="visible">
                    <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
                    <Label
                        htmlFor="theme-dark"
                        className="flex h-full flex-col items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 peer-data-[state=checked]:border-orange-500 dark:peer-data-[state=checked]:border-orange-500 [&:has([data-state=checked])]:border-orange-500 dark:[&:has([data-state=checked])]:border-orange-500 cursor-pointer transition-all duration-200"
                    >
                        <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 p-3 mb-3">
                            <Moon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">Modo Oscuro</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
              Reduce la fatiga visual en entornos con poca luz
            </span>
                    </Label>
                </motion.div>

                <motion.div className="h-full" custom={2} variants={itemVariants} initial="hidden" animate="visible">
                    <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
                    <Label
                        htmlFor="theme-system"
                        className="flex h-full flex-col items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 peer-data-[state=checked]:border-orange-500 dark:peer-data-[state=checked]:border-orange-500 [&:has([data-state=checked])]:border-orange-500 dark:[&:has([data-state=checked])]:border-orange-500 cursor-pointer transition-all duration-200"
                    >
                        <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3 mb-3">
                            <Monitor className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200">Automático</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
              Se adapta a la configuración de tu dispositivo
            </span>
                    </Label>
                </motion.div>
            </RadioGroup>

            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">¿Sabías que?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    El modo oscuro puede reducir el consumo de batería en dispositivos con pantallas OLED o AMOLED, además de
                    disminuir la fatiga visual durante el uso nocturno.
                </p>
            </div>
        </div>
    )
}
