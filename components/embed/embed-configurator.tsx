"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Copy, Code, ExternalLink, Check, Settings, EyeIcon, Smartphone, Monitor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const AVAILABLE_CURRENCIES = [
    { id: "USD", name: "Dólar Estadounidense", icon: "💵" },
    { id: "ECU", name: "Euro", icon: "💶" },
    { id: "MLC", name: "Moneda Libremente Convertible", icon: "💳" },
    { id: "TRX", name: "Tron", icon: "🪙" },
    { id: "USDT_TRC20", name: "Tether (USDT)", icon: "🔷" },
    { id: "BTC", name: "Bitcoin", icon: "₿" },
]

export function EmbedConfigurator() {
    const { toast } = useToast()
    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(["USD", "ECU", "MLC"])
    const [title, setTitle] = useState("🔥 Candela 🔥")
    const [showDate, setShowDate] = useState(true)
    const [showHeader, setShowHeader] = useState(true)
    const [compact, setCompact] = useState(false)
    const [showBranding, setShowBranding] = useState(true)
    const [theme, setTheme] = useState<"light" | "dark">("light")
    const [previewSize, setPreviewSize] = useState<"mobile" | "desktop">("desktop")
    const [copied, setCopied] = useState<"url" | "iframe" | null>(null)
    const [activeTab, setActiveTab] = useState("preview")

    // Generar URL para el iframe
    const generateEmbedUrl = () => {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL
        const params = new URLSearchParams()

        params.append("currencies", selectedCurrencies.join(","))
        params.append("theme", theme)

        if (title !== "🔥 Candela 🔥") {
            params.append("title", title)
        }

        if (!showDate) params.append("showDate", "false")
        if (!showHeader) params.append("showHeader", "false")
        if (compact) params.append("compact", "true")
        if (!showBranding) params.append("showBranding", "false")

        return `${baseUrl}embed?${params.toString()}`
    }

    // Generar código HTML para el iframe
    const generateIframeCode = () => {
        const url = generateEmbedUrl()
        return `<iframe
  src="${url}"
  width="100%"
  height="400"
  frameborder="0"
  scrolling="no"
  style="border-radius: 8px; overflow: hidden;"
  title="Tasas de Cambio - Peso Cubano"
></iframe>`
    }

    // Manejar la copia al portapapeles
    const handleCopy = (type: "url" | "iframe") => {
        const textToCopy = type === "url" ? generateEmbedUrl() : generateIframeCode()

        navigator.clipboard.writeText(textToCopy).then(
            () => {
                setCopied(type)
                setTimeout(() => setCopied(null), 2000)

                toast({
                    title: "Copiado al portapapeles",
                    description: type === "url" ? "URL copiada correctamente" : "Código HTML copiado correctamente",
                })
            },
            (err) => {
                console.error("Error al copiar:", err)
                toast({
                    title: "Error al copiar",
                    description: "No se pudo copiar al portapapeles",
                    variant: "destructive",
                })
            },
        )
    }

    // Manejar cambios en las monedas seleccionadas
    const handleCurrencyToggle = (currencyId: string) => {
        setSelectedCurrencies((prev) => {
            if (prev.includes(currencyId)) {
                return prev.filter((id) => id !== currencyId)
            } else {
                return [...prev, currencyId]
            }
        })
    }

    return (
        <Card className="w-full max-w-4xl mx-auto dark:bg-slate-900">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-amber-600" />
                    Configurador de Widget
                </CardTitle>
                <CardDescription>
                    Personaliza y obtén el código para integrar el widget de tasas de cambio en tu sitio web
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-6">
                        <TabsList className="grid grid-cols-2 w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 rounded-md transition-all duration-200">
                                <EyeIcon className="h-4 w-4" />
                                Vista previa
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 rounded-md transition-all duration-200">
                                <Settings className="h-4 w-4" />
                                Configuración
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="preview" className="p-6 pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Vista previa</h3>
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                <Button
                                    variant={previewSize === "mobile" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setPreviewSize("mobile")}
                                    className="gap-1 dark:hover:bg-slate-700"
                                >
                                    <Smartphone className="h-4 w-4" />
                                    <span className="hidden sm:inline">Móvil</span>
                                </Button>
                                <Button
                                    variant={previewSize === "desktop" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setPreviewSize("desktop")}
                                    className="gap-1 dark:hover:bg-slate-700"
                                >
                                    <Monitor className="h-4 w-4" />
                                    <span className="hidden sm:inline">Escritorio</span>
                                </Button>
                            </div>
                        </div>

                        <div
                            className={cn(
                                "border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden mx-auto transition-all duration-300",
                                previewSize === "mobile" ? "max-w-[375px]" : "w-full",
                            )}
                        >
                            <iframe
                                src={generateEmbedUrl()}
                                className="w-full"
                                height="400"
                                frameBorder="0"
                                title="Vista previa del widget"
                            />
                        </div>

                        <div className="mt-6 space-y-4">
                            <div>
                                <Label className="text-sm font-medium mb-2 block">URL del widget</Label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={generateEmbedUrl()}
                                        className="font-mono text-xs bg-slate-50 dark:bg-slate-800"
                                    />
                                    <Button variant="outline" size="sm" onClick={() => handleCopy("url")} className="flex-shrink-0 gap-1 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700">
                                        {copied === "url" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        {copied === "url" ? "Copiado" : "Copiar"}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium mb-2 block">Código HTML para iframe</Label>
                                <div className="relative">
                  <pre className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs overflow-x-auto font-mono border border-slate-200 dark:border-slate-700">
                    {generateIframeCode()}
                  </pre>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopy("iframe")}
                                        className="absolute top-2 right-2 gap-1 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                                    >
                                        {copied === "iframe" ? <Check className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                                        {copied === "iframe" ? "Copiado" : "Copiar"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="p-6 pt-4 space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Personalización</h3>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="widget-title" className="text-sm font-medium mb-2 block">
                                        Título del widget
                                    </Label>
                                    <Input
                                        id="widget-title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Tasas de Cambio - Peso Cubano"
                                        className="max-w-md dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Opciones de visualización</Label>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Switch id="show-header" checked={showHeader} onCheckedChange={setShowHeader} />
                                                <Label htmlFor="show-header">Mostrar encabezado</Label>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="show-date"
                                                    checked={showDate}
                                                    onCheckedChange={setShowDate}
                                                    disabled={!showHeader}
                                                />
                                                <Label htmlFor="show-date">Mostrar fecha y hora</Label>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Switch id="compact-mode" checked={compact} onCheckedChange={setCompact} />
                                                <Label htmlFor="compact-mode">Modo compacto</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Tema</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button
                                                variant={theme === "light" ? "default" : "outline"}
                                                className={theme === "light" ? "bg-amber-600 hover:bg-amber-700" : ""}
                                                onClick={() => setTheme("light")}
                                            >
                                                Claro
                                            </Button>
                                            <Button
                                                variant={theme === "dark" ? "default" : "outline"}
                                                className={theme === "dark" ? "bg-amber-600 hover:bg-amber-700" : ""}
                                                onClick={() => setTheme("dark")}
                                            >
                                                Oscuro
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-lg font-medium mb-4">Monedas a mostrar</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {AVAILABLE_CURRENCIES.map((currency) => (
                                    <div
                                        key={currency.id}
                                        className={cn(
                                            "flex items-center space-x-2 p-3 rounded-lg border transition-colors",
                                            selectedCurrencies.includes(currency.id)
                                                ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                                                : "border-slate-200 dark:border-slate-700",
                                        )}
                                    >
                                        <Checkbox
                                            id={`currency-${currency.id}`}
                                            checked={selectedCurrencies.includes(currency.id)}
                                            onCheckedChange={() => handleCurrencyToggle(currency.id)}
                                            className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{currency.icon}</span>
                                            <div>
                                                <Label htmlFor={`currency-${currency.id}`} className="font-medium cursor-pointer">
                                                    {currency.id === "ECU" ? "EUR" : currency.id}
                                                </Label>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{currency.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedCurrencies.length === 0 && (
                                <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                    Debes seleccionar al menos una moneda
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-6 gap-4">
                <Button
                    variant="outline"
                    onClick={() => window.open("/embed", "_blank")}
                    className="gap-1 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 w-full sm:w-auto"
                >
                    <ExternalLink className="h-4 w-4" />
                    Abrir en nueva pestaña
                </Button>

                <Button
                    onClick={() => {
                        setActiveTab("preview");
                        handleCopy("iframe");
                    }}
                    disabled={selectedCurrencies.length === 0}
                    className="gap-1 bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
                >
                    <Code className="h-4 w-4" />
                    Obtener código
                </Button>
            </CardFooter>
        </Card>
    )
}
