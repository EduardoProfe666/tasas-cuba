"use client"

import { ExchangeRatesDashboard } from "@/components/exchange-rates-dashboard"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { InfoDisclaimer } from "@/components/info-disclaimer"
import Link from "next/link"
import { LineChartIcon as ChartLineUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {useRef, useState} from "react";
import {SyncModal, SyncStatus} from "@/components/sync-modal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const lastTap = useRef(0);

  function handleHatClick() {
    const now = Date.now();
    if (now - lastTap.current < 400) {
      setModalOpen(true);
    }
    lastTap.current = now;
  }

  async function handleSync() {
    setSyncStatus("loading");
    try {
      const resp = await fetch("/api/sync");
      const data = await resp.json();
      if (data.success) {
        setSyncStatus("success");
      } else {
        setSyncStatus("error");
      }
    } catch {
      setSyncStatus("error");
    }
    setTimeout(() => {
      setModalOpen(false);
      setSyncStatus("idle");
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-slate-800 dark:text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
            Tasas de Cambio - Peso Cubano
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-4">
            Información actualizada sobre las tasas de cambio en Cuba. Consulta las tasas históricas y compara con días
            anteriores.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6"
          >
            <Link href="/analisis-historico">
              <Button
                variant="outline"
                size="lg"
                className="group bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700 text-emerald-600 dark:text-emerald-400"
              >
                <ChartLineUp className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Análisis histórico
              </Button>
            </Link>
          </motion.div>
        </header>
        <ExchangeRatesDashboard />
        <div className="mt-8 mb-8">
          <InfoDisclaimer />
        </div>
        <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-8">
          <p>
            Desarrollado por{" "}
            <a
                href="https://eduardoprofe666.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
            >
              EduardoProfe666
            </a>
            <span
                className="ml-1 cursor-pointer transition-transform hover:scale-125"
                onClick={handleHatClick}
                onTouchEnd={handleHatClick}
                title="Sincronizar tasas"
                style={{userSelect: "none"}}
            >
                🎩
              </span>
          </p>
        </footer>
      </div>
      <SyncModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSyncStatus("idle");
          }}
          onSync={handleSync}
          status={syncStatus}
      />
      <PWAInstallPrompt/>
    </main>
  )
}
