"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Palette, Check } from "lucide-react"
import { useEffect, useState } from "react"

const themes = [
  { name: "Purple", value: "purple", color: "bg-purple-600" },
  { name: "Blue", value: "blue", color: "bg-blue-600" },
  { name: "Green", value: "green", color: "bg-emerald-600" },
  { name: "Orange", value: "orange", color: "bg-orange-600" },
  { name: "Rose", value: "rose", color: "bg-rose-600" },
  { name: "Teal", value: "teal", color: "bg-teal-600" },
]

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("purple")

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("crm-theme") || "purple"
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  const changeTheme = (theme: string) => {
    setCurrentTheme(theme)
    localStorage.setItem("crm-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem key={theme.value} onClick={() => changeTheme(theme.value)} className="cursor-pointer">
            <div className="flex items-center gap-3 w-full">
              <div className={`h-5 w-5 rounded ${theme.color}`} />
              <span>{theme.name}</span>
              {currentTheme === theme.value && <Check className="h-4 w-4 ml-auto" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
