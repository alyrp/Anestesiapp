"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  open: boolean
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose: () => void
}

export function Toast({ open, title, description, variant = "default", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300) // Tiempo para la animación de salida
      return () => clearTimeout(timer)
    }
  }, [open])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          "rounded-md border p-4 shadow-md transition-all",
          open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          variant === "destructive"
            ? "border-red-200 bg-red-50 text-red-900"
            : "border-gray-200 bg-white text-gray-900",
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {title && <div className="font-medium">{title}</div>}
            {description && <div className="text-sm text-gray-500">{description}</div>}
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-gray-100" aria-label="Cerrar">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export const ToastProvider = () => null
export const ToastViewport = () => null
export const ToastTitle = () => null
export const ToastDescription = () => null
export const ToastClose = () => null
export const ToastAction = () => null

