"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !imageRef.current || !contentRef.current) return

      const scrolled = window.scrollY
      const heroTop = heroRef.current.offsetTop
      const heroHeight = heroRef.current.offsetHeight
      const windowHeight = window.innerHeight

      // Only apply parallax when hero is in viewport
      if (scrolled + windowHeight > heroTop && scrolled < heroTop + heroHeight) {
        const parallaxOffset = (scrolled - heroTop) * 0.5
        
        // Background image moves slower (parallax effect) - moves down slower
        imageRef.current.style.transform = `translateZ(-150px) translateY(${parallaxOffset * 0.4}px) scale(1.05)`
        
        // Content moves faster in opposite direction (creates depth)
        contentRef.current.style.transform = `translateZ(80px) translateY(${-parallaxOffset * 0.15}px)`
      } else {
        // Reset when out of viewport
        if (imageRef.current) {
          imageRef.current.style.transform = `translateZ(-150px) scale(1.05)`
        }
        if (contentRef.current) {
          contentRef.current.style.transform = `translateZ(80px)`
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={heroRef} className="section-hero">
      {/* Background Image Layer */}
      <div ref={imageRef} className="hero-bg-image" />
      
      {/* Overlay Gradient */}
      <div className="hero-overlay" />
      
      {/* Content Layer */}
      <div className="page-shell relative z-10">
        <div ref={contentRef} className="hero-content text-center px-4">
          <h1 className="hero-heading font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6 text-foreground">
            Your Dream Wedding Starts Here
          </h1>
          <p className="hero-description text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/95 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto font-medium px-4">
            Choose from our curated packages designed for every budget and style
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Link href="/planner" className="w-full sm:w-auto">
              <Button size="lg" className="btn-primary hero-btn-primary w-full sm:w-auto">
                Plan My Wedding
              </Button>
            </Link>
            <Link href="/packages" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="hero-btn-secondary w-full sm:w-auto">
                Browse Packages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

