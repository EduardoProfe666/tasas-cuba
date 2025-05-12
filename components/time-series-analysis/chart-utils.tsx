import {ExchangeRateData} from "@/types/exchange-rate";
import {differenceInDays, format} from "date-fns";

export const calculateCurrencyMetricsAdvanced = (historicalData: ExchangeRateData[], currency: string) => {
    const dataPoints = historicalData
        .filter(x => x.currency.code === currency)
        .map(item => ({
            date: new Date(item.date),
            value: item.value
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (dataPoints.length < 2) {
        console.log(1)
        return {
            baseValue: dataPoints.length ? dataPoints[0].value : 100,
            volatility: 0.01
        };
    }

    const baseValue = dataPoints[dataPoints.length - 1].value;

    const returns = [];
    for (let i = 1; i < dataPoints.length; i++) {
        const daysDiff = (dataPoints[i].date.getTime() - dataPoints[i-1].date.getTime()) / (1000 * 60 * 60 * 24);

        if (daysDiff <= 3) {
            const dailyReturn = (dataPoints[i].value - dataPoints[i-1].value) / dataPoints[i-1].value;
            returns.push(dailyReturn);
        }
    }

    if (returns.length > 10) {
        const sortedReturns = [...returns].sort((a, b) => a - b);
        const q1Index = Math.floor(returns.length * 0.25);
        const q3Index = Math.floor(returns.length * 0.75);
        const iqr = sortedReturns[q3Index] - sortedReturns[q1Index];
        const lowerBound = sortedReturns[q1Index] - 1.5 * iqr;
        const upperBound = sortedReturns[q3Index] + 1.5 * iqr;

        const filteredReturns = returns.filter(ret => ret >= lowerBound && ret <= upperBound);

        if (filteredReturns.length > 0) {
            returns.length = 0;
            returns.push(...filteredReturns);
        }
    }

    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const squaredDiffs = returns.map(ret => Math.pow(ret - meanReturn, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / returns.length;
    const volatility = Math.sqrt(variance);

    return {
        baseValue,
        volatility: Math.max(volatility, 0.005)
    };
};

export const calculateTrend = (historicalData: ExchangeRateData[], currency: string): number => {
    if (!historicalData || historicalData.length < 2) {
        return 0;
    }
    const dataPoints = historicalData
        .filter(x => x.currency.code === currency)
        .map(item => ({
            date: new Date(item.date),
            value: item.value
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (dataPoints.length < 2) return 0;

    const firstValue = dataPoints[0].value;
    const lastValue = dataPoints[dataPoints.length - 1].value;
    const totalDays = differenceInDays(dataPoints[dataPoints.length - 1].date, dataPoints[0].date) || 1;

    const totalPercentChange = (lastValue - firstValue) / firstValue;
    const dailyTrend = totalPercentChange / totalDays;

    return Math.max(Math.min(dailyTrend, 0.05), -0.05);
};

export const interpolateValue = (
    currentDate: Date,
    startDate: Date,
    endDate: Date,
    startValue: number,
    endValue: number
): number => {
    const totalDays = differenceInDays(endDate, startDate) || 1;
    const daysPassed = differenceInDays(currentDate, startDate) || 0;
    const ratio = daysPassed / totalDays;

    return startValue + (endValue - startValue) * ratio;
};

export const findNextRealDateIndex = (
    currentDate: Date,
    allDays: Date[],
    dataByDate: Map<string, number>
): number => {
    const currentIndex = allDays.findIndex(d =>
        d.getFullYear() === currentDate.getFullYear() &&
        d.getMonth() === currentDate.getMonth() &&
        d.getDate() === currentDate.getDate()
    );

    if (currentIndex === -1) return -1;

    for (let i = currentIndex + 1; i < allDays.length; i++) {
        const dateStr = format(allDays[i], "yyyy-MM-dd");
        if (dataByDate.has(dateStr)) {
            return i;
        }
    }

    return -1;
};

export const currencyColors: Record<string, { stroke: string; fill: string }> = {
    USD: { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.1)" },
    ECU: { stroke: "#3b82f6", fill: "rgba(59, 130, 246, 0.1)" },
    MLC: { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.1)" },
    TRX: { stroke: "#8b5cf6", fill: "rgba(139, 92, 246, 0.1)" },
    USDT_TRC20: { stroke: "#ec4899", fill: "rgba(236, 72, 153, 0.1)" },
    BTC: { stroke: "#f97316", fill: "rgba(249, 115, 22, 0.1)" },
}

export const calculateSMA = (data: any[], field: string, period: number) => {
    const result = []

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push({ ...data[i], sma: null })
        } else {
            let sum = 0
            for (let j = 0; j < period; j++) {
                sum += data[i - j][field]
            }
            const sma = sum / period
            result.push({ ...data[i], sma })
        }
    }

    return result
}

export const calculateEMA = (data: any[], field: string, period: number) => {
    const result = []
    const multiplier = 2 / (period + 1)

    let ema = 0
    let sum = 0

    for (let i = 0; i < period; i++) {
        sum += data[i][field]
    }

    ema = sum / period
    result.push({ ...data[0], ema: null })

    for (let i = 1; i < data.length; i++) {
        if (i < period) {
            result.push({ ...data[i], ema: null })
        } else {
            ema = (data[i][field] - ema) * multiplier + ema
            result.push({ ...data[i], ema })
        }
    }

    return result
}

export const calculateBollingerBands = (data: any[], field: string, period: number, stdDev = 2) => {
    const result = []

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push({
                ...data[i],
                middleBand: null,
                upperBand: null,
                lowerBand: null,
            })
        } else {
            let sum = 0
            for (let j = 0; j < period; j++) {
                sum += data[i - j][field]
            }
            const middleBand = sum / period

            let sumSquaredDiff = 0
            for (let j = 0; j < period; j++) {
                sumSquaredDiff += Math.pow(data[i - j][field] - middleBand, 2)
            }
            const standardDeviation = Math.sqrt(sumSquaredDiff / period)
            const upperBand = middleBand + standardDeviation * stdDev
            const lowerBand = middleBand - standardDeviation * stdDev

            result.push({
                ...data[i],
                middleBand,
                upperBand,
                lowerBand,
            })
        }
    }

    return result
}

export const calculateRSI = (data: any[], field: string, period = 14) => {
    const result = []

    if (data.length <= period) {
        return data.map((item) => ({ ...item, rsi: null }))
    }

    const changes = []
    for (let i = 1; i < data.length; i++) {
        changes.push(data[i][field] - data[i - 1][field])
    }

    for (let i = 0; i < period; i++) {
        result.push({ ...data[i], rsi: null })
    }

    let avgGain = 0
    let avgLoss = 0

    for (let i = 0; i < period; i++) {
        if (changes[i] > 0) {
            avgGain += changes[i]
        } else {
            avgLoss += Math.abs(changes[i])
        }
    }

    avgGain /= period
    avgLoss /= period

    let rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss)
    let rsi = 100 - 100 / (1 + rs)

    result.push({ ...data[period], rsi })

    for (let i = period + 1; i < data.length; i++) {
        const change = changes[i - 1]
        const gain = change > 0 ? change : 0
        const loss = change < 0 ? Math.abs(change) : 0

        avgGain = (avgGain * (period - 1) + gain) / period
        avgLoss = (avgLoss * (period - 1) + loss) / period

        rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss)
        rsi = 100 - 100 / (1 + rs)

        result.push({ ...data[i], rsi })
    }

    return result
}

export const calculateMACD = (data: any[], field: string, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    const fastEMA = []
    const multiplierFast = 2 / (fastPeriod + 1)
    let emaFast = data[0][field]

    for (let i = 0; i < data.length; i++) {
        emaFast = (data[i][field] - emaFast) * multiplierFast + emaFast
        fastEMA.push(emaFast)
    }

    const slowEMA = []
    const multiplierSlow = 2 / (slowPeriod + 1)
    let emaSlow = data[0][field]

    for (let i = 0; i < data.length; i++) {
        emaSlow = (data[i][field] - emaSlow) * multiplierSlow + emaSlow
        slowEMA.push(emaSlow)
    }

    const macdLine = []
    for (let i = 0; i < data.length; i++) {
        macdLine.push(fastEMA[i] - slowEMA[i])
    }

    const signalLine = []
    const multiplierSignal = 2 / (signalPeriod + 1)
    let emaSignal = macdLine[0]

    for (let i = 0; i < macdLine.length; i++) {
        if (i < slowPeriod - 1) {
            signalLine.push(null)
        } else {
            emaSignal = (macdLine[i] - emaSignal) * multiplierSignal + emaSignal
            signalLine.push(emaSignal)
        }
    }

    const result = []
    for (let i = 0; i < data.length; i++) {
        const histogram = macdLine[i] - (signalLine[i] || 0)
        result.push({
            ...data[i],
            macd: macdLine[i],
            signal: signalLine[i],
            histogram: signalLine[i] !== null ? histogram : null,
        })
    }

    return result
}

export const calculateStochastic = (data: any[], field: string, kPeriod = 14, dPeriod = 3) => {
    const result = []

    if (data.length <= kPeriod) {
        return data.map((item) => ({ ...item, k: null, d: null }))
    }

    const kValues = []

    for (let i = 0; i < data.length; i++) {
        if (i < kPeriod - 1) {
            result.push({ ...data[i], k: null, d: null })
            kValues.push(null)
        } else {
            let highestHigh = Number.NEGATIVE_INFINITY
            let lowestLow = Number.POSITIVE_INFINITY

            for (let j = 0; j < kPeriod; j++) {
                const value = data[i - j][field]
                highestHigh = Math.max(highestHigh, value)
                lowestLow = Math.min(lowestLow, value)
            }

            const k = ((data[i][field] - lowestLow) / (highestHigh - lowestLow)) * 100
            kValues.push(k)

            if (i < kPeriod + dPeriod - 2) {
                result.push({ ...data[i], k, d: null })
            } else {
                let sumD = 0
                for (let j = 0; j < dPeriod; j++) {
                    sumD += kValues[kValues.length - 1 - j]!
                }
                const d = sumD / dPeriod

                result.push({ ...data[i], k, d })
            }
        }
    }

    return result
}
