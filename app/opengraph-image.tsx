import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "Tasas de Cambio - Peso Cubano"
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 96,
            marginRight: 16,
          }}
        >
          💵
        </div>
        <div
          style={{
            fontSize: 96,
            marginRight: 16,
          }}
        >
          💶
        </div>
        <div
          style={{
            fontSize: 96,
          }}
        >
          💳
        </div>
      </div>
      <div
        style={{
          background: "linear-gradient(to right, #10b981, #14b8a6)",
          backgroundClip: "text",
          color: "transparent",
          fontSize: 64,
          fontWeight: "bold",
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Tasas de Cambio - Peso Cubano
      </div>
      <div
        style={{
          fontSize: 32,
          color: "#475569",
          textAlign: "center",
          maxWidth: "80%",
        }}
      >
        Consulta las tasas de cambio actualizadas del peso cubano
      </div>
    </div>,
    {
      ...size,
    },
  )
}
