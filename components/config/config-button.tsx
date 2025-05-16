"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfigDialog } from "./config-dialog"
import { motion, AnimatePresence } from "framer-motion"

export function ConfigButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <AnimatePresence>
                <motion.div
                    className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white border-none"
                        aria-label="Configuración"
                    >
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Configuración</span>
                    </Button>
                </motion.div>
            </AnimatePresence>

            <ConfigDialog open={isOpen} onOpenChange={setIsOpen} />
        </>
    )
}
