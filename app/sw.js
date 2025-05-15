// Este archivo es generado automáticamente por next-pwa
// No es necesario modificarlo manualmente

// Escuchar evento push para mostrar notificaciones
self.addEventListener("push", (event) => {
    if (event.data) {
        const data = event.data.json()

        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: data.icon || "/icons/icon-192x192.png",
                badge: data.badge || "/icons/badge-72x72.png",
                data: data.data,
                vibrate: [200, 100, 200],
                tag: data.tag || "tasas-cuba-notification",
                renotify: true,
                actions: data.actions || [],
                requireInteraction: true,
            }),
        )
    }
})

// Manejar clics en notificaciones
self.addEventListener("notificationclick", (event) => {
    event.notification.close()

    // Manejar acciones específicas
    if (event.action === "view-details") {
        // Abrir la página principal o de detalles
        event.waitUntil(clients.openWindow("/"))
    } else if (event.action === "dismiss") {
        // No hacer nada, solo cerrar la notificación
        return
    } else {
        // Comportamiento por defecto al hacer clic en la notificación
        event.waitUntil(clients.openWindow("/"))
    }
})

// Manejar cierre de notificaciones
self.addEventListener("notificationclose", (event) => {
    // Podríamos registrar analíticas aquí si fuera necesario
    console.log("Notification closed", event.notification)
})
