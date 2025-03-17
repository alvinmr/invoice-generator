"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Check, Laptop, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ThemeOption {
  value: string
  label: string
  icon: React.ReactNode
}

const themes: ThemeOption[] = [
  {
    value: "light",
    label: "Terang",
    icon: <Sun className="h-4 w-4" />,
  },
  {
    value: "dark",
    label: "Gelap",
    icon: <Moon className="h-4 w-4" />,
  },
  {
    value: "system",
    label: "Sistem",
    icon: <Laptop className="h-4 w-4" />,
  },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)

  const currentTheme = themes.find((t) => t.value === theme) || themes[2]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-2 w-[120px] justify-between"
        >
          {currentTheme.icon}
          <span>{currentTheme.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[120px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {themes.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(value) => {
                    setTheme(value)
                    setOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {theme === item.value && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
