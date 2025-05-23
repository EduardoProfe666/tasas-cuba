"use client"
import {format} from "date-fns"
import {CalendarIcon} from "lucide-react"
import {es} from "date-fns/locale"
import type {Locale} from "date-fns"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"

interface DatePickerProps {
    date: Date
    onSelect: (date: Date | undefined) => void
    locale?: Locale
    disabled?: boolean
    minDate?: Date
    maxDate?: Date
    fixedWidthMd?: boolean
}

export function DatePicker({date, onSelect, locale = es, disabled = false, minDate, maxDate, fixedWidthMd = true,}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    size="lg"
                    className={cn("w-full justify-start text-left font-normal dark:hover:bg-slate-700 dark:bg-slate-800 focus:ring-emerald-400 dark:border-slate-700", !date && "text-muted-foreground", fixedWidthMd && "md:w-[240px]")}
                    disabled={disabled}
                >
                    <CalendarIcon className="-ml-3 h-4 w-4"/>
                    {date ? format(date, "PPP", {locale}) : <span>Seleccionar fecha</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar className="dark:bg-slate-800 " mode="single" selected={date} onSelect={onSelect} initialFocus locale={locale}
                          minDate={minDate}
                          maxDate={maxDate}/>
            </PopoverContent>
        </Popover>
    )
}
