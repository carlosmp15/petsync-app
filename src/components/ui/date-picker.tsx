import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { format, getMonth, getYear, setMonth, setYear } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { es } from "date-fns/locale"
import { useUserStore } from "@/stores/userStore" // Asegúrate de tener la ruta correcta de tu store

interface DatePickerProps {
  startYear?: number
  endYear?: number
  selected?: Date // Si se pasa, se usará como fecha seleccionada
  onSelect?: (value: Date) => void // Cambiado a tipo adecuado
}

export function DatePicker({
  startYear = getYear(new Date()) - 100,
  endYear = getYear(new Date()) + 100,
  selected,
  onSelect,
}: DatePickerProps) {
  const { birthday, setBirthday } = useUserStore() // Si no usas zustand, esto se puede eliminar

  const [date, setDate] = useState<Date>(selected || birthday || new Date()) // Inicia con selected, o birthday si está disponible, o la fecha actual

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ]

  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  // Actualizar la fecha del mes seleccionado
  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate)
    if (onSelect) onSelect(newDate) // Usamos onSelect si está disponible
    else setBirthday(newDate) // Si no hay onSelect, actualizamos el estado global
  }

  // Actualizar la fecha del año seleccionado
  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate)
    if (onSelect) onSelect(newDate) // Usamos onSelect si está disponible
    else setBirthday(newDate) // Si no hay onSelect, actualizamos el estado global
  }

  // Seleccionar una nueva fecha
  const handleSelect = (selectedData: Date | undefined) => {
    if (selectedData) {
      setDate(selectedData)
      if (onSelect) onSelect(selectedData) // Usamos onSelect si está disponible
      else setBirthday(selectedData) // Si no hay onSelect, actualizamos el estado global
    }
  }

  // Si `birthday` de zustand está vacío, lo inicializamos con `selected` o la fecha actual
  useEffect(() => {
    if (!birthday && !selected) {
      setBirthday(new Date())
    } else if (selected && !birthday) {
      setBirthday(selected)
    }
  }, [birthday, selected, setBirthday])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[250px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: es }) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between p-2">
          <Select onValueChange={handleMonthChange} value={months[getMonth(date)]}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleYearChange} value={getYear(date).toString()}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date} // Se usa la fecha actual o la que viene por la prop selected
          onSelect={handleSelect} // Actualiza la fecha al seleccionar un día
          initialFocus
          month={date}
          onMonthChange={setDate} // Se usa para cambiar el mes
        />
      </PopoverContent>
    </Popover>
  )
}

