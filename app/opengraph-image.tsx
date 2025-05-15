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
                background: "linear-gradient(135deg, #ed5c3a 0%, #d68438 70%, #d39140 100%)", // naranja cálido degradado
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
                <span style={{ textShadow: "0 2px 8px rgba(0,0,0,0.30)", fontSize: 110, lineHeight: 1, userSelect: "none" }} role="img" aria-label="Dinero en efectivo">💵</span>
                <span style={{ textShadow: "0 2px 8px rgba(0,0,0,0.30)", fontSize: 110, lineHeight: 1, userSelect: "none" }} role="img" aria-label="Euro">💶</span>
                <span style={{ textShadow: "0 2px 8px rgba(0,0,0,0.30)", fontSize: 127, lineHeight: 1, userSelect: "none" }} role="img" aria-label="Tarjeta de crédito">💳</span>
            </div>

            {/* TÍTULO */}
            <h1
                style={{
                    fontSize: 70,
                    fontWeight: 900,
                    margin: 0,
                    marginBottom: 18,
                    textAlign: "center",
                    color: "#fff",
                    textShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    letterSpacing: "-1px",
                    userSelect: "none",
                    fontFamily: '"Poppins", "Inter", sans-serif',
                }}
            >
                <span style={{
                    fontWeight: 700,
                    fontSize: 70,
                    color: "#e89460", // naranja claro candela
                    textShadow: "0 2px 8px rgba(0,0,0,0.30)"
                }}>
                    🔥 Candela 🔥
                </span>
            </h1>

            {/* DESCRIPCIÓN */}
            <p
                style={{
                    fontSize: 30,
                    maxWidth: 800,
                    textAlign: "center",
                    color: "#FFE8D6", // tono crema anaranjado claro
                    margin: 0,
                    marginBottom: 0,
                    lineHeight: 1.4,
                    fontWeight: 500,
                    userSelect: "none",
                    textShadow: "0 2px 8px rgba(0,0,0,0.20)",
                }}
            >
                Consulta en tiempo real las tasas de cambio del peso cubano y accede al análisis
                de datos históricos para tomar mejores decisiones financieras.
            </p>

            {/* AUTOR */}
            <div
                style={{
                    position: "absolute",
                    bottom: 32,
                    left: 40,
                    fontSize: 22,
                    color: "#FFD8B1", // naranja pálido
                    fontWeight: 600,
                    fontStyle: "italic",
                    userSelect: "none",
                    fontFamily: '"Fira Mono", "Courier New", Courier, monospace',
                    textShadow: "0 2px 8px rgba(0,0,0,0.13)",
                    letterSpacing: "0.5px",
                    background: "rgba(0,0,0,0.10)",
                    padding: "6px 18px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                }}
                aria-label="Autor"
            >
                Creado por <span style={{ textShadow: "0 2px 8px rgba(0,0,0,0.30)", marginLeft: 8, color: "#ec8e49", fontWeight: 700 }}>EduardoProfe666🎩@Medialityc</span>
            </div>

            {/* POWERED BY ELTOQUE */}
            <div
                style={{
                    position: "absolute",
                    bottom: 32,
                    right: 40,
                    fontSize: 22,
                    color: "#FFD8B1",
                    fontWeight: 600,
                    fontStyle: "italic",
                    userSelect: "none",
                    fontFamily: '"Fira Mono", "Courier New", Courier, monospace',
                    textShadow: "0 2px 8px rgba(0,0,0,0.13)",
                    letterSpacing: "0.5px",
                    background: "rgba(0,0,0,0.10)",
                    padding: "6px 18px",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                }}
                aria-label="Powered by elToque"
            >
                Powered by <span style={{textShadow: "0 2px 8px rgba(0,0,0,0.30)", marginLeft: 8, color: "#ec8e49", fontWeight: 700 }}>elToque</span>
            </div>
        </div>,
        { ...size }
    );
}
