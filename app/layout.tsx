import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { OfflineAlert } from "@/components/offline-alert"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tasas de Cambio - Peso Cubano",
  icons: {
    icon: '/icons/icon.png',
    apple: '/icons/apple-touch-icon.png'
  },
  description:
    "Consulta las tasas de cambio actualizadas del peso cubano (CUP) frente a USD, Euro, MLC y otras monedas. Información histórica y comparativa diaria.",
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
  publisher: "Eduardo Alejandro González Martell",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.APP_URL,
    title: "Tasas de Cambio - Peso Cubano | Consulta Actualizada",
    description:
      "Consulta las tasas de cambio actualizadas del peso cubano (CUP) frente a USD, Euro, MLC y otras monedas. Información histórica y comparativa diaria.",
    siteName: "Tasas de Cambio - Peso Cubano",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tasas de Cambio - Peso Cubano | Consulta Actualizada",
    description:
      "Consulta las tasas de cambio actualizadas del peso cubano (CUP) frente a USD, Euro, MLC y otras monedas.",
    creator: "@eduardoprofe666",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.APP_URL,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tasas Cuba",
  },
  formatDetection: {
    telephone: false,
  },
  applicationName: "Tasas Cuba",
  themeColor: "#10b981",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <OfflineAlert />
          <SpeedInsights/>
          <Analytics/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
