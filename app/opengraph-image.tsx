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
                fontFamily:
                    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                background:
                    "radial-gradient(circle at top left, #10b981, #14b8a6 60%, #0f766e 100%)",
                width: "100%",
                height: "100%",
                color: "#f0f9ff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 48,
                boxSizing: "border-box",
                position: "relative",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: 24,
                    marginBottom: 40,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                }}
                aria-label="Iconos de monedas y tarjeta"
            >
        <span
            style={{
                fontSize: 112,
                lineHeight: 1,
                userSelect: "none",
            }}
            role="img"
            aria-label="Dinero en efectivo"
        >
          💵
        </span>
                <span
                    style={{
                        fontSize: 112,
                        lineHeight: 1,
                        userSelect: "none",
                    }}
                    role="img"
                    aria-label="Euro"
                >
          💶
        </span>
                <span
                    style={{
                        fontSize: 112,
                        lineHeight: 1,
                        userSelect: "none",
                    }}
                    role="img"
                    aria-label="Tarjeta de crédito"
                >
          💳
        </span>
            </div>

            <h1
                style={{
                    fontSize: 72,
                    fontWeight: 900,
                    margin: 0,
                    marginBottom: 20,
                    textAlign: "center",
                    background:
                        "linear-gradient(90deg, #a7f3d0, #22c55e, #14b8a6, #0f766e)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    textShadow:
                        "0 2px 8px rgba(0, 0, 0, 0.2), 0 0 12px rgba(20, 184, 166, 0.6)",
                    userSelect: "none",
                    fontFamily: '"Poppins", sans-serif',
                }}
            >
                Tasas de Cambio
                <br />
                <span style={{ fontWeight: 700, fontSize: 56, color: "#d1fae5" }}>
          Peso Cubano
        </span>
            </h1>

            <p
                style={{
                    fontSize: 28,
                    maxWidth: 720,
                    textAlign: "center",
                    color: "#d1d5db",
                    margin: 0,
                    lineHeight: 1.4,
                    fontWeight: 500,
                    userSelect: "none",
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
                }}
            >
                Consulta las tasas de cambio actualizadas del peso cubano en tiempo real,
                con datos confiables y precisos.
            </p>

            <div
                style={{
                    position: "absolute",
                    bottom: 24,
                    right: 24,
                    fontSize: 18,
                    color: "rgba(255, 255, 255, 0.6)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    userSelect: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: '"Courier New", Courier, monospace',
                }}
                aria-label="Autor"
            >
                <span>Creado por</span>
                <span
                    style={{
                        background:
                            "linear-gradient(45deg, #34d399, #059669, #065f46)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        fontWeight: "bold",
                    }}
                >
          EduardoProfe666
        </span>
                <span role="img" aria-label="Sombrero de copa">
          🎩
        </span>
            </div>
        </div>,
        {
            ...size,
        }
    );
}
