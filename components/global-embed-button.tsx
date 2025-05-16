"use client"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Code} from "lucide-react"
import {motion, AnimatePresence} from "framer-motion"
import Link from "next/link"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export function GlobalEmbedButton() {

    return (
        <div className="fixed bottom-36 right-4 md:bottom-20 md:right-6 z-40">
            <Link href="/embed-configurator">
                <AnimatePresence>
                    <motion.div
                        className="fixed bottom-36 right-4 md:bottom-20 md:right-6 z-40"
                        initial={{scale: 0, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0, opacity: 0}}
                        transition={{type: "spring", stiffness: 260, damping: 20}}
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        <TooltipProvider>
                            <Tooltip supportMobileTap delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-none"
                                        aria-label="Configurar widget embebible"
                                    >
                                        <Code className="h-5 w-5"/>
                                        <span className="sr-only">Configurar widget embebible</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    <p className="max-w-xs">
                                        Widget Embebible
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </motion.div>
                </AnimatePresence>
            </Link>
        </div>
    )
}
