'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile: any
  }
}

export default function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    function renderWidget() {
      if (window.turnstile && ref.current && !widgetId.current) {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
          callback: (token: string) => onVerify(token),
        })
      }
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          renderWidget()
          clearInterval(interval)
        }
      }, 200)
      return () => clearInterval(interval)
    }
  }, [onVerify])

  return <div ref={ref} />
}