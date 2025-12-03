"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollSmooth() {
  const pathname = usePathname()

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth"
    
    // Function to initialize scroll animations
    const initScrollAnimations = () => {
      // Intersection Observer for fade-in animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-visible")
            // Add stagger delay for children
            const children = entry.target.querySelectorAll(".scroll-child")
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("scroll-visible")
              }, index * 100)
            })
          }
        })
      }, observerOptions)

      // Observe all scroll-triggered elements
      const scrollElements = document.querySelectorAll(
        ".scroll-fade, .scroll-slide-up, .scroll-slide-left, .scroll-slide-right"
      )
      
      // Also observe scroll-child elements directly
      const scrollChildren = document.querySelectorAll(".scroll-child")
      
      scrollElements.forEach((el) => {
        // Check if element is already in viewport on mount
        const rect = el.getBoundingClientRect()
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isInViewport) {
          // If already visible, add class immediately
          el.classList.add("scroll-visible")
          const children = el.querySelectorAll(".scroll-child")
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("scroll-visible")
            }, index * 100)
          })
        } else {
          // Otherwise observe for when it enters viewport
          observer.observe(el)
        }
      })

      // Handle scroll-child elements that are not inside scroll-fade parents
      scrollChildren.forEach((child) => {
        const rect = child.getBoundingClientRect()
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isInViewport) {
          // If already visible, add class immediately
          child.classList.add("scroll-visible")
        } else {
          // Otherwise observe for when it enters viewport
          observer.observe(child)
        }
      })

      return observer
    }

    // Initialize animations
    let observer = initScrollAnimations()

    // Re-initialize after a short delay to catch any dynamically loaded content
    const timeoutId = setTimeout(() => {
      observer.disconnect()
      observer = initScrollAnimations()
    }, 100)

    // Parallax for sections
    const handleParallax = () => {
      const scrolled = window.scrollY
      const parallaxElements = document.querySelectorAll(".parallax-slow, .parallax-fast")
      
      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + scrolled
        const elementHeight = rect.height
        const windowHeight = window.innerHeight
        
        // Only animate when in viewport
        if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
          const offset = (scrolled + windowHeight - elementTop) * 0.5
          
          if (element.classList.contains("parallax-slow")) {
            (element as HTMLElement).style.transform = `translateY(${offset * 0.3}px)`
          } else if (element.classList.contains("parallax-fast")) {
            (element as HTMLElement).style.transform = `translateY(${-offset * 0.2}px)`
          }
        }
      })
    }

    // Throttled scroll handler
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleParallax()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    handleParallax() // Initial call

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", onScroll)
      observer.disconnect()
    }
  }, [pathname]) // Re-run when pathname changes

  return null
}

