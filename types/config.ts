export type ThemeMode = "light" | "dark" | "system"
export type NotificationFrequency = "hourly" | "6hours" | "daily" | "never"
export type NotificationType = "major" | "all" | "up" | "down"

export interface CurrencyNotificationSettings {
    enabled: boolean
    threshold: number // Porcentaje de cambio para notificar
}

export interface NotificationSettings {
    enabled: boolean
    currencies: {
        USD: CurrencyNotificationSettings
        ECU: CurrencyNotificationSettings
        MLC: CurrencyNotificationSettings
        TRX: CurrencyNotificationSettings
        USDT_TRC20: CurrencyNotificationSettings
        BTC: CurrencyNotificationSettings
    }
    frequency: NotificationFrequency
    type: NotificationType
    quietHoursEnabled: boolean
    quietHoursStart: string // Formato "HH:MM"
    quietHoursEnd: string // Formato "HH:MM"
}

export interface PrivacySettingsType {
    saveHistory: boolean
    saveOfflineData: boolean
}

export interface AppConfig {
    theme: ThemeMode
    notifications: NotificationSettings
    privacy: PrivacySettingsType
    lastUpdated: string // ISO date string
}

export const DEFAULT_CONFIG: AppConfig = {
    theme: "system",
    notifications: {
        enabled: false,
        currencies: {
            USD: { enabled: true, threshold: 5 },
            ECU: { enabled: true, threshold: 5 },
            MLC: { enabled: true, threshold: 5 },
            TRX: { enabled: false, threshold: 5 },
            USDT_TRC20: { enabled: false, threshold: 5 },
            BTC: { enabled: false, threshold: 5 },
        },
        frequency: "daily",
        type: "major",
        quietHoursEnabled: true,
        quietHoursStart: "22:00",
        quietHoursEnd: "07:00",
    },
    privacy: {
        saveHistory: true,
        saveOfflineData: true,
    },
    lastUpdated: new Date().toISOString(),
}
