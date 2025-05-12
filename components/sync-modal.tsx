"use client"
import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export type SyncStatus = "idle" | "loading" | "success" | "error";

interface SyncModalProps {
    open: boolean;
    onClose: () => void;
    onSync: () => void;
    status: SyncStatus;
}

export const SyncModal: FC<SyncModalProps> = ({ open, onClose, onSync, status }) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 w-full max-w-sm text-center relative"
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        <button
                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            onClick={onClose}
                            aria-label="Cerrar"
                            disabled={status === "loading"}
                            type="button"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold mb-2">Sincronización</h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-300">
                            ¿Quieres sincronizar las tasas de cambio ahora?
                        </p>
                        {status === "idle" && (
                            <button
                                onClick={onSync}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
                                type="button"
                            >
                                Sincronizar ahora
                            </button>
                        )}
                        {status === "loading" && (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin w-10 h-10 text-emerald-600" />
                                <span className="text-emerald-600 font-medium mt-2">
                  Sincronizando...
                </span>
                            </div>
                        )}
                        {status === "success" && (
                            <div className="flex flex-col items-center gap-2">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  ¡Sincronización exitosa!
                </span>
                            </div>
                        )}
                        {status === "error" && (
                            <div className="flex flex-col items-center gap-2">
                                <XCircle className="w-10 h-10 text-red-500" />
                                <span className="text-red-600 font-medium">
                  Ocurrió un error. Intenta de nuevo.
                </span>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
