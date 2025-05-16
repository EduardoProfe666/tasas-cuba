"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AppearanceSettings } from "./appearance-settings"
import { NotificationSettings } from "./notification-settings"
import { PrivacySettings } from "./privacy-settings"
import { useConfig } from "@/hooks/use-config"
import {Paintbrush, BellRing, Shield, RotateCcw, ShieldAlert} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Separator } from "@/components/ui/separator"

interface ConfigDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ConfigDialog({ open, onOpenChange }: ConfigDialogProps) {
    const [activeTab, setActiveTab] = useState("appearance")
    const { resetConfig } = useConfig()
    const [isResetting, setIsResetting] = useState(false)

    const handleReset = () => {
        setIsResetting(true)
        setTimeout(() => {
            resetConfig()
            setIsResetting(false)
        }, 800)
    }

    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:max-w-[650px] sm:max-w-[500px] max-w-[380px] max-h-[95%] p-0 gap-0 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 shadow-xl">
                <DialogHeader className="p-6 pb-2 rounded-t-xl">
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400">
                        Configuración
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Personaliza tu experiencia en Tasas Cuba
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-6 pt-4">
                        <TabsList className="grid grid-cols-3 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <TabsTrigger
                                value="appearance"
                                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 rounded-md transition-all duration-200"
                            >
                                <Paintbrush className="h-4 w-4" />
                                <span className="hidden sm:inline">Apariencia</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="notifications"
                                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 rounded-md transition-all duration-200"
                            >
                                <BellRing className="h-4 w-4" />
                                <span className="hidden sm:inline">Notificaciones</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="privacy"
                                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 rounded-md transition-all duration-200"
                            >
                                <ShieldAlert className="h-4 w-4" />
                                <span className="hidden sm:inline">Privacidad</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="h-[60vh] px-6 py-4">
                        <AnimatePresence mode="wait">
                            {activeTab === "appearance" && (
                                <TabsContent value="appearance" asChild forceMount>
                                    <motion.div
                                        key="appearance"
                                        variants={tabVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="mt-2 mb-6 focus:outline-none"
                                    >
                                        <AppearanceSettings />
                                    </motion.div>
                                </TabsContent>
                            )}

                            {activeTab === "notifications" && (
                                <TabsContent value="notifications" asChild forceMount>
                                    <motion.div
                                        key="notifications"
                                        variants={tabVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="mt-2 mb-6 focus:outline-none"
                                    >
                                        <NotificationSettings />
                                    </motion.div>
                                </TabsContent>
                            )}

                            {activeTab === "privacy" && (
                                <TabsContent value="privacy" asChild forceMount>
                                    <motion.div
                                        key="privacy"
                                        variants={tabVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="mt-2 mb-6 focus:outline-none"
                                    >
                                        <PrivacySettings />
                                    </motion.div>
                                </TabsContent>
                            )}
                        </AnimatePresence>
                    </ScrollArea>
                </Tabs>

                <Separator className="bg-slate-200 dark:bg-slate-700" />
                <DialogFooter className="p-4 flex flex-row items-center justify-center gap-3 w-full min-h-16">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={isResetting}
                        className="flex-1 gap-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-800 transition-all duration-200"
                    >
                        <RotateCcw className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
                        {isResetting ? "Restableciendo..." : "Restablecer valores"}
                    </Button>
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white transition-all duration-200"
                    >
                        Guardar y cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
