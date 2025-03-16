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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {theme === "light" ? (
            <>
              <Sun className="h-[1.2rem] w-[1.2rem]" />
              <span>Mode Terang</span>
            </>
          ) : theme === "dark" ? (
            <>
              <Moon className="h-[1.2rem] w-[1.2rem]" />
              <span>Mode Gelap</span>
            </>
          ) : (
            <>
            <Computer className="h-[1.2rem] w-[1.2rem]" />
              <span>Tema Sistem</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
          <Sun className="h-4 w-4" />
          <span>Mode Terang</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
          <Moon className="h-4 w-4" />
          <span>Mode Gelap</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
          <span className="relative flex items-center">
            <Computer className="h-4 w-4" />
          </span>
          <span>Tema Sistem</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
