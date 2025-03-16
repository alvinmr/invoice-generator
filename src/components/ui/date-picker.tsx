"use client"

import * as React from "react"
import { format, startOfDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { id } from 'date-fns/locale'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  placeholder?: string
  defaultDate?: Date // Tambahkan prop untuk tanggal default
}

export function DatePicker({ 
  date, 
  setDate, 
  className, 
  placeholder = "Pilih tanggal",
  defaultDate, // Terima tanggal default sebagai prop
}: DatePickerProps) {
  // Gunakan React.useEffect untuk mengatur nilai default jika tanggal belum disetel
  React.useEffect(() => {
    if (!date && defaultDate) {
      setDate(startOfDay(defaultDate));
    }
  }, [date, defaultDate, setDate]);

  // Pastikan tanggal disetel dengan startOfDay untuk menghindari masalah zona waktu
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      setDate(startOfDay(date));
    } else {
      setDate(undefined);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd MMMM yyyy", { locale: id }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={id}
          defaultMonth={date || defaultDate} // Tunjukkan bulan dari tanggal yang dipilih atau tanggal default
        />
      </PopoverContent>
    </Popover>
  )
}
