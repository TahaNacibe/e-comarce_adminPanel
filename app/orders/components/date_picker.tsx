"use client"

import { format } from "date-fns"
import { CalendarIcon, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ date, setDate }:{date:any, setDate:any}) {
  

  return (
    <Popover>
      <PopoverTrigger asChild className="border shadow-none bg-gray-50">
        <Button
          variant={"outline"}
          className={cn(
            "max-w-[200px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
        <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
