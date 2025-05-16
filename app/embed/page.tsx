import { EmbedWidget } from "@/components/embed/embed-widget"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Candela Widget",
    description: "Widget embebible de tasas de cambio del peso cubano (CUP)",
}

export default function EmbedPage({
                                      searchParams,
                                  }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    // Extraer parámetros de la URL
    const currencies = searchParams.currencies
        ? Array.isArray(searchParams.currencies)
            ? searchParams.currencies
            : searchParams.currencies.split(",")
        : ["USD", "ECU", "MLC"] // Monedas por defecto

    const theme = searchParams.theme === "dark" ? "dark" : "light"
    const title = searchParams.title ? String(searchParams.title) : undefined
    const showDate = searchParams.showDate !== "false"
    const showHeader = searchParams.showHeader !== "false"
    const compact = searchParams.compact === "true"
    const showBranding = searchParams.showBranding !== "false"

    return (
        <div className={`${theme} overflow-hidden bg-transparent h-full`}>
            <div className="p-0 m-0 w-full h-full">
                <EmbedWidget
                    currencies={currencies}
                    title={title}
                    showDate={showDate}
                    showHeader={showHeader}
                    compact={compact}
                    showBranding={showBranding}
                />
            </div>
        </div>
)
}
