'use client'

import { useState, useEffect } from 'react'
import { HeroMobile } from './HeroMobile'
import { HeroDesktop } from './HeroDesktop'

export function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return isMobile ? <HeroMobile /> : <HeroDesktop />
} 