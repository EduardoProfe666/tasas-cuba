"use client"

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
import { Download, FileImage, FileJson, FileSpreadsheet, FileIcon as FilePdf, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"
import {ExchangeRateData} from "@/types/exchange-rate";

interface DataExportProps {
  data1: ExchangeRateData[]
  data2: ExchangeRateData[]
  date1: Date
  date2: Date
  elementId: string
}

export function DataExport({ data1, data2, date1, date2, elementId }: DataExportProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const prepareExportData = () => {
    const currencyOrder = ["USD", "ECU", "MLC", "TRX", "USDT_TRC20", "BTC"]
    const currencyNames: Record<string, string> = {
      USD: "Dólar Estadounidense",
      TRX: "Tron",
      MLC: "Moneda Libremente Convertible",
      ECU: "Euro",
      USDT_TRC20: "Tether (USDT)",
      BTC: "Bitcoin",
    }

    return currencyOrder.map((currency) => {
      const er1 = data1.find(x => x.currency.code === currency)
      const er2 = data2.find(x => x.currency.code === currency)

      const rate1 = er1?.value || 1
      const rate2 = er2?.value || 1
      const difference = rate2 - rate1
      const percentChange = (difference / rate1) * 100

      return {
        Moneda: currency,
        Nombre: currencyNames[currency] || currency,
        [`Tasa ${formatDate(date1)}`]: rate1,
        [`Tasa ${formatDate(date2)}`]: rate2,
        Diferencia: difference.toFixed(2),
        "Cambio (%)": percentChange.toFixed(2) + "%",
      }
    })
  }

  const exportAsImage = async (format: "png" | "jpeg") => {
    setIsExporting(true)
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error("Elemento no encontrado")
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
        logging: false,
      })

      // WATERMARK
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.font = "12px Arial"
        ctx.fillStyle = document.documentElement.classList.contains("dark")
          ? "rgba(255,255,255,0.3)"
          : "rgba(0,0,0,0.3)"
        ctx.fillText("Datos proporcionados por elToque - " + process.env.APP_URL, 10, canvas.height - 10)
      }

      const link = document.createElement("a")
      link.download = `comparacion-tasas-${formatDate(date1)}-vs-${formatDate(date2)}.${format}`
      link.href = canvas.toDataURL(`image/${format}`, format === "jpeg" ? 0.8 : 1.0)
      link.click()

      toast({
        title: "Exportación completada",
        description: `Imagen exportada en formato ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error("Export image error:", error)
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
    setIsExporting(true)
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error("Elemento no encontrado")
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
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
        "Datos proporcionados por elToque - Tasas del mercado informal de divisas en Cuba",
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: "center" },
      )

      pdf.save(`comparacion-tasas-${formatDate(date1)}-vs-${formatDate(date2)}.pdf`)

      toast({
        title: "Exportación completada",
        description: "Documento PDF generado correctamente",
      })
    } catch (error) {
      console.error("Export PDF error:", error)
      toast({
        variant: "destructive",
        title: "Error al exportar",
        description: "No se pudo generar el PDF. Inténtalo de nuevo.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsJSON = () => {
    setIsExporting(true)
    try {
      const exportData = {
        metadata: {
          generatedAt: new Date().toISOString(),
          source: "elToque - Tasas del mercado informal de divisas en Cuba",
          disclaimer: "Estas tasas no corresponden a la tasa oficial de Cuba, sino al mercado informal de divisas.",
          sourceUrl: "https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy",
        },
        comparison: {
          date1: formatDate(date1),
          date2: formatDate(date2),
          data: prepareExportData(),
        },
        rawData: {
          date1: {
            date: date1,
            exchangeRates: data1
          },
          date2: {
            date: date2,
            exchangeRates: data2
          },
        },
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.download = `comparacion-tasas-${formatDate(date1)}-vs-${formatDate(date2)}.json`
      link.href = url
      link.click()

      URL.revokeObjectURL(url)

      toast({
        title: "Exportación completada",
        description: "Datos exportados en formato JSON",
      })
    } catch (error) {
      console.error("JSON Export error:", error)
      toast({
        variant: "destructive",
        title: "Error al exportar",
        description: "No se pudieron exportar los datos en formato JSON.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsExcel = () => {
    setIsExporting(true)
    try {
      const exportData = prepareExportData()

      const worksheet = XLSX.utils.json_to_sheet(exportData)

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Comparación de Tasas")

      // Añadir una hoja con metadatos
      const metadataSheet = XLSX.utils.json_to_sheet([
        {
          Fuente: "elToque - Tasas del mercado informal de divisas en Cuba",
          Advertencia: "Estas tasas no corresponden a la tasa oficial de Cuba, sino al mercado informal de divisas.",
          "Fecha de generación": new Date().toLocaleString(),
          "Más información": "https://eltoque.com/tasas-de-cambio-de-moneda-en-cuba-hoy",
        },
      ])
      XLSX.utils.book_append_sheet(workbook, metadataSheet, "Información")

      // Generar el archivo Excel
      XLSX.writeFile(workbook, `comparacion-tasas-${formatDate(date1)}-vs-${formatDate(date2)}.xlsx`)

      toast({
        title: "Exportación completada",
        description: "Datos exportados en formato Excel",
      })
    } catch (error) {
      console.error("Error al exportar Excel:", error)
      toast({
        variant: "destructive",
        title: "Error al exportar",
        description: "No se pudieron exportar los datos en formato Excel.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isExporting}>
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Exportar datos
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => exportAsImage("png")} disabled={isExporting}>
          <FileImage className="mr-2 h-4 w-4" />
          <span>Imagen PNG</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAsImage("jpeg")} disabled={isExporting}>
          <FileImage className="mr-2 h-4 w-4" />
          <span>Imagen JPEG</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsPDF} disabled={isExporting}>
          <FilePdf className="mr-2 h-4 w-4" />
          <span>Documento PDF</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportAsJSON} disabled={isExporting}>
          <FileJson className="mr-2 h-4 w-4" />
          <span>Datos JSON</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsExcel} disabled={isExporting}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Hoja de cálculo Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
