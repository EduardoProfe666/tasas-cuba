import { EmbedConfigurator } from "@/components/embed/embed-configurator"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {ConfigButton} from "@/components/config/config-button";
import React from "react";

export const metadata: Metadata = {
    title: "Configurador de Widget | Tasas Cuba",
    description: "Configura y obtén el código para integrar el widget de tasas de cambio en tu sitio web",
}

export default function EmbedConfiguratorPage() {
    return (
        <main
            className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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

                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-800 dark:text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 dark:from-orange-400 dark:to-amber-300">
                        Configurador de Widget
                    </h1>
                    <p className="text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Personaliza y obtén el código para integrar el widget de tasas de cambio en tu sitio web o blog
                    </p>
                </header>

                <div
                    className="mt-12 mb-12 max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Instrucciones de uso</h2>

                    <div className="space-y-4 text-slate-600 dark:text-slate-400">
                        <p>
                            El widget de tasas de cambio te permite integrar fácilmente las tasas actualizadas del peso
                            cubano en tu
                            sitio web o blog. Sigue estos pasos para implementarlo:
                        </p>

                        <ol className="list-decimal ml-5 space-y-2 marker:text-orange-500 dark:marker:text-amber-500">
                            <li>Personaliza el widget según tus preferencias usando las opciones de configuración.</li>
                            <li>Previsualiza cómo se verá el widget en diferentes dispositivos.</li>
                            <li>Copia el código HTML generado para el iframe.</li>
                            <li>Pega el código en el HTML de tu sitio web donde desees que aparezca el widget.</li>
                        </ol>

                        <p>
                            El widget se actualizará automáticamente con las tasas más recientes cada vez que se cargue
                            la página.
                            Puedes ajustar el ancho y alto del iframe según tus necesidades.
                        </p>
                    </div>
                </div>

                <EmbedConfigurator/>
            </div>
            <ConfigButton/>
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
                <p className="p-4">
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
        </main>
    )
}
