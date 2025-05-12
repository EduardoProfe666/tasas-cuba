"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileImage, FileIcon as FilePdf, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface ChartExportProps {
    chartRef: React.RefObject<HTMLDivElement | null>
    currency: string
    startDate: Date
    endDate: Date
}

export function ChartExport({ chartRef, currency, startDate, endDate }: ChartExportProps) {
    const { toast } = useToast()
    const [isExporting, setIsExporting] = useState(false)

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0]
    }

    const exportAsImage = async (format: "png" | "jpeg") => {
        if (!chartRef.current) {
            toast({
                variant: "destructive",
                title: "Error al exportar",
                description: "No se pudo encontrar el gráfico para exportar.",
            })
            return
        }

        setIsExporting(true)
        try {
            const canvas = await html2canvas(chartRef.current, {
                scale: 2,
                backgroundColor: "#1e293b",
                logging: false,
            })

            const ctx = canvas.getContext("2d")
            if (ctx) {
                ctx.font = "12px Arial"
                ctx.fillStyle = "rgba(255,255,255,0.3)"
                ctx.fillText("Datos proporcionados por El Toque - " + process.env.APP_URL, 10, canvas.height - 10)
            }

            const link = document.createElement("a")
            link.download = `grafico-${currency}-${formatDate(startDate)}-a-${formatDate(endDate)}.${format}`
            link.href = canvas.toDataURL(`image/${format}`, format === "jpeg" ? 0.8 : 1.0)
            link.click()

            toast({
                title: "Exportación completada",
                description: `Imagen exportada en formato ${format.toUpperCase()}`,
            })
        } catch (error) {
            console.error("Error al exportar imagen:", error)
            toast({
                variant: "destructive",
                title: "Error al exportar",
                description: "No se pudo generar la imagen. Inténtalo de nuevo.",
            })
        } finally {
            setIsExporting(false)
        }
    }

    const exportAsPDF = async () => {
        if (!chartRef.current) {
            toast({
                variant: "destructive",
                title: "Error al exportar",
                description: "No se pudo encontrar el gráfico para exportar.",
            })
            return
        }

        setIsExporting(true)
        try {
            const canvas = await html2canvas(chartRef.current, {
                scale: 2,
                backgroundColor: "#1e293b",
                logging: false,
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
            })

            const imgWidth = 280
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)

            pdf.setFontSize(10)
            pdf.setTextColor(100, 100, 100)
            pdf.text(
                "Datos proporcionados por El Toque - Tasas del mercado informal de divisas en Cuba",
                pdf.internal.pageSize.getWidth() / 2,
                pdf.internal.pageSize.getHeight() - 10,
                { align: "center" },
            )

            pdf.save(`grafico-${currency}-${formatDate(startDate)}-a-${formatDate(endDate)}.pdf`)

            toast({
                title: "Exportación completada",
                description: "Documento PDF generado correctamente",
            })
        } catch (error) {
            console.error("Error al exportar PDF:", error)
            toast({
                variant: "destructive",
                title: "Error al exportar",
                description: "No se pudo generar el PDF. Inténtalo de nuevo.",
            })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-300"
                    disabled={isExporting}
                >
                    {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Exportar gráfico
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700 text-slate-300">
                <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem
                    onClick={() => exportAsImage("png")}
                    disabled={isExporting}
                    className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                    <FileImage className="mr-2 h-4 w-4" />
                    <span>Imagen PNG</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => exportAsImage("jpeg")}
                    disabled={isExporting}
                    className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                    <FileImage className="mr-2 h-4 w-4" />
                    <span>Imagen JPEG</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={exportAsPDF}
                    disabled={isExporting}
                    className="hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
                >
                    <FilePdf className="mr-2 h-4 w-4" />
                    <span>Documento PDF</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
