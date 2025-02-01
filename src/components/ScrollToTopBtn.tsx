'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'

export default function SmoothScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.pageYOffset
      const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (scrollTop / winHeight) * 100

      setScrollProgress(scrolled)

      if (scrollTop > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const smoothScrollToTop = () => {
    const startPosition = window.pageYOffset
    const startTime = performance.now()
    const duration = 1000 // Duration of scroll in milliseconds

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easeProgress = easeOutCubic(progress)

      window.scrollTo(0, startPosition * (1 - easeProgress))

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Button
            onClick={smoothScrollToTop}
            aria-label="Scroll to top"
            className="group relative h-14 w-14 rounded-full bg-primary p-0 text-primary-foreground shadow-lg transition-all z-50 hover:bg-primary/90"
          >
            <div className="absolute inset-0 rounded-full border-4 border-primary" style={{ clipPath: `inset(${100 - scrollProgress}% 0 0 0)` }} />
            <ArrowUp className="h-6 w-6" />
            <span className="absolute left-full ml-2 hidden whitespace-nowrap rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground group-hover:block">
              Back to Top
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}