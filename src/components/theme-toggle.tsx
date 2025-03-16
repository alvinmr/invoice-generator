"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Computer } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so we can safely show the UI once we're in the browser
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" className="gap-2 w-full sm:w-auto">
        <span className="h-4 w-4" />
        <span className="hidden sm:inline">Theme</span>
        <span className="sm:hidden">Theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 w-full sm:w-auto">
          {theme === "light" ? (
            <>
              <Sun className="h-4 w-4" />
              <span className="hidden sm:inline">Mode Terang</span>
              <span className="sm:hidden">Terang</span>
            </>
          ) : theme === "dark" ? (
            <>
              <Moon className="h-4 w-4" />
              <span className="hidden sm:inline">Mode Gelap</span>
              <span className="sm:hidden">Gelap</span>
            </>
          ) : (
            <>
              <Computer className="h-4 w-4" />
              <span className="hidden sm:inline">Tema Sistem</span>
              <span className="sm:hidden">Sistem</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
          <Sun className="h-4 w-4" />
          <span>Mode Terang</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
          <Moon className="h-4 w-4" />
          <span>Mode Gelap</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
          <Computer className="h-4 w-4" />
          <span>Tema Sistem</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
