'use client'

import { Sun, Moon, Loader2  } from "lucide-react"
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from "./ui/button"

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() =>  setMounted(true), [])

  if (!mounted) return (
   <div className="p-3"><Loader2 className="h-5 w-5 text-primary animate-spin" /></div>
  )

  if (resolvedTheme === 'dark') {
    return <Button variant={'ghost'} size={'icon'}  onClick={() => setTheme('light')}><Sun className="h-6 w-6 text-[#030712] dark:text-white"  /></Button>
  }

  if (resolvedTheme === 'light') {
    return <Button variant={'ghost'} size={'icon'}  onClick={() => setTheme('dark')}><Moon className="h-6 w-6 text-[#030712] dark:text-white" /></Button>
  }

}