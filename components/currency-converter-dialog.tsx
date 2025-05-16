"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {ArrowLeftRight, Copy, Check, Calculator, X, TrendingUp, Repeat2, Flashlight} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {motion} from "framer-motion";

interface CurrencyConverterDialogProps {
    currency: string
    currencyName: string
    rate: number
    icon: string
}

export function CurrencyConverterDialog({ currency, currencyName, rate, icon }: CurrencyConverterDialogProps) {
    const [amount, setAmount] = useState<string>("1")
    const [result, setResult] = useState<string>(rate.toFixed(2))
    const [isInverted, setIsInverted] = useState<boolean>(false)
    const [copied, setCopied] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    // Calcular el resultado basado en la cantidad y la dirección de conversión
    const calculateResult = (value: string, inverted: boolean) => {
        const numValue = Number.parseFloat(value) || 0

        if (inverted) {
            // CUP a moneda extranjera (dividir)
            return (numValue / rate).toFixed(2)
        } else {
            // Moneda extranjera a CUP (multiplicar)
            return (numValue * rate).toFixed(2)
        }
    }

    // Actualizar resultado cuando cambie la tasa o la inversión
    useEffect(() => {
        setResult(calculateResult(amount, isInverted))
    }, [rate, isInverted])

    // Enfocar el input cuando se abre el diálogo
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }, [isOpen])

    // Manejar cambio en el campo de entrada
    const handleAmountChange = (value: string) => {
        // Permitir solo números y un punto decimal
        if (!/^(\d+)?(\.\d*)?$/.test(value) && value !== "") return

        setAmount(value)

        if (value === "") {
            setResult("")
            return
        }

        setResult(calculateResult(value, isInverted))
    }

    // Intercambiar dirección de conversión
    const handleSwap = () => {
        setIsInverted(!isInverted)
        // Al invertir, el resultado actual se convierte en la nueva cantidad de entrada
        setAmount(result)
        setResult(calculateResult(result, !isInverted))
    }

    const numberFormatter = new Intl.NumberFormat('en-US');

    // Copiar resultado al portapapeles
    const handleCopy = () => {
        const toCurrency = isInverted ? currency : "CUP"
        const textToCopy = `${result} ${toCurrency === 'ECU' ? 'EUR' : toCurrency}`

        navigator.clipboard.writeText(textToCopy).then(
            () => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)

                toast({
                    title: "Copiado al portapapeles",
                    description: textToCopy,
                    variant: "default",
                })
            },
            (err) => {
                console.error("No se pudo copiar: ", err)
                toast({
                    title: "Error al copiar",
                    description: "No se pudo copiar al portapapeles",
                    variant: "destructive",
                })
            },
        )
    }

    const getFormattedRate = () => {
        const fromCurrency = isInverted ? "CUP" : (currency === 'ECU' ? 'EUR' : currency)
        const toCurrency = isInverted ? (currency === 'ECU' ? 'EUR' : currency) : "CUP"
        const formattedRate = isInverted ? (1 / rate).toFixed(5) : rate.toFixed(2)
        return `1 ${fromCurrency} = ${formattedRate} ${toCurrency}`
    }

    const [rotation, setRotation] = useState(0)
    const handleSwapWithRotation = () => {
        setRotation(prev => prev + 180)
        handleSwap()
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full gap-1 bg-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
                    aria-label="Abrir conversor de moneda"
                >
                    <Calculator className="h-4 w-4" />
                    <span>Conversor Rápido</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] max-w-[90%] xs p-4 border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg">
                <DialogHeader className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-xl">
                                {icon}
                            </div>
                            <DialogTitle className="text-lg font-medium">Conversor de {currency === 'ECU' ? 'EUR' : currency}</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-4 space-y-3">
                    {/* Conversor */}
                    <div className="space-y-3">
                        {/* Campo de entrada */}
                        <div
                            className={cn(
                                "relative rounded-md border border-slate-200 dark:border-slate-700 p-2 transition-all",
                                isFocused ? "ring-1 ring-orange-500" : "hover:border-slate-300 dark:hover:border-slate-600",
                                "bg-white dark:bg-slate-800",
                            )}
                            onClick={() => inputRef.current?.focus()}
                        >
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                                {isInverted ? "Cantidad en CUP" : `Cantidad en ${currency === 'ECU' ? 'EUR' : currency}`}
                            </label>
                            <div className="flex items-center">
                                <div
                                    className="w-6 h-6 flex items-center justify-center text-sm mr-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                                    {isInverted ? "🇨🇺" : icon}
                                </div>
                                <input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    step="any"
                                    inputMode="decimal"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    placeholder="0"
                                    aria-label={`Cantidad en ${isInverted ? "CUP" : (currency === 'ECU' ? 'EUR' : currency)}`}
                                    className="w-full px-1 py-1 rounded-lg bg-white dark:bg-slate-800 text-md font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                                />
                                <div className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                                    {isInverted ? "CUP" : (currency === 'ECU' ? 'EUR' : currency)}
                                </div>
                            </div>
                        </div>

                        {/* Botón de intercambio */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleSwapWithRotation}
                                className="p-2 rounded-full bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300 transition flex-shrink-0"
                                aria-label="Invertir dirección"
                                title="Invertir dirección"
                            >
                                <motion.div
                                    animate={{rotate: rotation}}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 15
                                    }}
                                >
                                    <Repeat2 className="w-6 h-6"/>
                                </motion.div>
                            </button>
                        </div>

                        {/* Campo de resultado (solo lectura) */}
                        <div
                            className="relative rounded-md border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800/50">
                            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                                {isInverted ? `Resultado en ${currency === 'ECU' ? 'EUR' : currency}` : "Resultado en CUP"}
                            </label>
                            <div className="flex items-center">
                                <div
                                    className="w-6 h-6 flex items-center justify-center text-sm mr-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                                    {isInverted ? icon : "🇨🇺"}
                                </div>
                                <div
                                    className="flex-1 h-8 flex items-center text-base font-medium text-slate-800 dark:text-slate-200 overflow-hidden">
                                    {numberFormatter.format(result as any)}
                                </div>
                                <div className="ml-2 text-sm text-slate-600 dark:text-slate-400 min-w-[40px]">
                                    {isInverted ? (currency === 'ECU' ? 'EUR' : currency) : "CUP"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tasa y botones */}
                    <div className="flex justify-between items-center pt-1">
                        <div className="text-sm text-slate-600 dark:text-slate-400">{getFormattedRate()}</div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="h-8 gap-1 text-sm dark:hover:bg-slate-700"
                            aria-label="Copiar resultado"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            <span>{copied ? "Copiado" : "Copiar"}</span>
                        </Button>
                    </div>

                    {/* Footer simplificado */}
                    <div className="pt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 mt-3">
                        <div className="flex items-center gap-1">
                            <Calculator className="h-3 w-3" />
                            <span>Convierte rápidamente</span>
                        </div>
                        <div>Actualizado hoy</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
