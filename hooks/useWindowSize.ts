"use client"

import { useState, useEffect } from "react"

export interface WindowSize {
  width: number
  height: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export function useWindowSize(): WindowSize {
  // Initialize with undefined or null to avoid hydration mismatch
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      const width = window.innerWidth
      const height = window.innerHeight

      setWindowSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      })

      // Update CSS variables for fluid styling in CCS
      document.documentElement.style.setProperty("--vw", `${width * 0.01}px`)
      document.documentElement.style.setProperty("--vh", `${height * 0.01}px`)
    }

    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}
