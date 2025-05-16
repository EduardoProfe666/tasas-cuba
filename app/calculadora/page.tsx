"use client"

import {PWAInstallPrompt} from "@/components/pwa-install-prompt"
import Calculator from "@/components/calculator";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {ConfigButton} from "@/components/config/config-button";
import type React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
              href="/"
              className="inline-flex items-center text-sm text-slate-600 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4"/>
            Volver a inicio
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-slate-800 dark:text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300">
            Calculadora Monetaria
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-4">
            Convierte y calcula tus monedas al instante con precisión y facilidad.
          </p>
        </header>
        <Calculator/>
        <footer
            className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-8">
          <p>
            Desarrollado por{" "}
            <a
                href="https://eduardoprofe666.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
              EduardoProfe666🎩
            </a>
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()}{" "}
            <a
                href="https://www.medialityc.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
              Medialityc
            </a>
            . Todos los derechos reservados.
          </p>
        </footer>
      </div>
      <PWAInstallPrompt/>
      <ConfigButton/>
    </main>
  )
}
