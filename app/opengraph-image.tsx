import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tasas de Cambio - Peso Cubano";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";


export default async function Image() {
    return new ImageResponse(
        <div
            style={{
                fontFamily: '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                background: "linear-gradient(135deg, #0f172a 0%, #155e75 70%, #22d3ee 100%)",
                width: "100%",
                height: "100%",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 64,
                boxSizing: "border-box",
                position: "relative",
            }}
        >
            {/* ICONOS */}
            <div
                style={{
                    display: "flex",
                    gap: 40,
                    marginBottom: 48,
                    filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
                }}
                aria-label="Iconos de monedas y tarjeta"
            >
                <span style={{ fontSize: 110, lineHeight: 1, userSelect: "none" }} role="img" aria-label="Dinero en efectivo">💵</span>
                <span style={{ fontSize: 110, lineHeight: 1, userSelect: "none" }} role="img" aria-label="Euro">💶</span>
                <span style={{ fontSize: 110, lineHeight: 1, userSelect: "none" }} role="img" aria-label="Tarjeta de crédito">💳</span>
            </div>

            {/* TÍTULO */}
            <h1
                style={{
                    fontSize: 70,
                    fontWeight: 900,
                    margin: 0,
                    marginBottom: 18,
                    textAlign: "center",
                    background: "linear-gradient(90deg, #f0fdff 0%, #67e8f9 40%, #38bdf8 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    textShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    letterSpacing: "-1px",
                    userSelect: "none",
                    fontFamily: '"Poppins", "Inter", sans-serif',
                }}
            >
                Tasas de Cambio
                <br />
                <span style={{
                    fontWeight: 700,
                    fontSize: 50,
                    color: "#fff",
                    background: "none",
                    textShadow: "0 2px 8px rgba(0,0,0,0.30)"
                }}>
                    Peso Cubano
                </span>
            </h1>

            {/* DESCRIPCIÓN */}
            <p
                style={{
                    fontSize: 32,
                    maxWidth: 800,
                    textAlign: "center",
                    color: "#e0e7ef",
                    margin: 0,
                    marginBottom: 0,
                    lineHeight: 1.4,
                    fontWeight: 500,
                    userSelect: "none",
                    textShadow: "0 2px 8px rgba(0,0,0,0.20)",
                }}
            >
                Consulta las tasas de cambio actualizadas del peso cubano en tiempo real,
                con datos confiables y precisos.
            </p>

            {/* AUTOR */}
            <div
                style={{
                    position: "absolute",
                    bottom: 32,
                    right: 40,
                    fontSize: 22,
                    color: "rgba(255,255,255,0.75)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    userSelect: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: '"Fira Mono", "Courier New", Courier, monospace',
                    textShadow: "0 2px 8px rgba(0,0,0,0.20)"
                }}
                aria-label="Autor"
            >
                <span>Creado por</span>
                <span style={{
                    background: "linear-gradient(45deg, #67e8f9, #38bdf8, #0ea5e9)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    fontWeight: "bold",
                }}>
                    EduardoProfe666
                </span>
                <span role="img" aria-label="Sombrero de copa">🎩</span>
            </div>
        </div>,
        { ...size }
    );
}
