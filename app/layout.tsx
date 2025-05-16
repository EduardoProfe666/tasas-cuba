import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { OfflineAlert } from "@/components/offline-alert"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ConfigProvider } from "@/hooks/use-config"
import { ConfigButton } from "@/components/config/config-button"
import { NotificationPermission } from "@/components/config/notification-permission"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    metadataBase: new URL("https://candela.medialityc.com"),

    title: "Candela",
    icons: {
        icon: "/icons/icon.png",
        apple: "/icons/apple-touch-icon.png",
    },
    description:
        "Consulta las tasas de cambio actualizadas del peso cubano (CUP) frente a USD, Euro, MLC y otras monedas. Calculadora, Información histórica y comparativa diaria.",
    keywords: [
        "tasas de cambio",
        "peso cubano",
        "CUP",
        "dólar",
        "euro",
        "MLC",
        "Cuba",
        "economía cubana",
        "tipo de cambio",
    ],
    authors: [{ name: "Eduardo Alejandro González Martell", url: "https://eduardoprofe666.github.io/" }],
    creator: "Eduardo Alejandro González Martell",
    publisher: "Medialityc",
    openGraph: {
        type: "website",
        locale: "es_ES",
        url: "/",
        title: "Candela",
        description:
            "Consulta las tasas de cambio actualizadas del peso cubano (CUP) frente a USD, Euro, MLC y otras monedas. Calculadora, Información histórica y comparativa diaria.",
        siteName: "Candela",
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "Candela Open Graph Image",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Candela | Tasas de cambio del Peso Cubano",
        description:
            "Consulta las tasas de cambio actualizadas del peso cubano (CUP) frente a USD, Euro, MLC y otras monedas. Calculadora, Información histórica y comparativa diaria.",
        creator: "@eduardoprofe666",
        images: ["/opengraph-image"],
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/",
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Candela",
    },
    formatDetection: {
        telephone: false,
    },
    applicationName: "Candela",
    themeColor: "#fb923c",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
        <head>
            <title>Candela</title>
            <meta name="theme-color" content="#fb923c" />
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        </head>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ConfigProvider>
                <OfflineAlert />
                <SpeedInsights />
                <Analytics />
                <NotificationPermission />
                {children}
            </ConfigProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
