"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function RouteChangeHandler() {
  const pathname = usePathname()

  useEffect(() => {
    // Force re-initialization of scroll animations on route change
    const reinitScrollAnimations = () => {
      // Remove all scroll-visible classes to reset state
      const allElements = document.querySelectorAll(
        ".scroll-fade, .scroll-slide-up, .scroll-slide-left, .scroll-slide-right, .scroll-child"
      )
      
      allElements.forEach((el) => {
        el.classList.remove("scroll-visible")
      })

      // Wait for DOM to update, then trigger scroll event to re-check viewport
      setTimeout(() => {
        // Dispatch a custom event that ScrollSmooth can listen to
        window.dispatchEvent(new Event("scroll"))
        
        // Also manually check and show elements already in viewport
        const checkViewport = () => {
          allElements.forEach((el) => {
            const rect = el.getBoundingClientRect()
            const isInViewport = rect.top < window.innerHeight + 100 && rect.bottom > -100
            
            if (isInViewport && !el.classList.contains("scroll-visible")) {
              el.classList.add("scroll-visible")
              
              // Handle children
              const children = el.querySelectorAll(".scroll-child")
              children.forEach((child, index) => {
                setTimeout(() => {
                  child.classList.add("scroll-visible")
                }, index * 100)
              })
            }
          })
        }

        checkViewport()
        
        // Also check after a short delay to catch any layout shifts
        setTimeout(checkViewport, 200)
      }, 50)
    }

    // Re-initialize on pathname change
    reinitScrollAnimations()
  }, [pathname])

  return null
}

