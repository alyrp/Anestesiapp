"use client"

import { createContext, useContext, type ReactNode } from "react"
import { Toast } from "@/components/ui/toast"
import { useToast, type ToastProps } from "@/components/ui/use-toast"

interface ToastContextType {
  toast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toast, open, props, dismiss } = useToast()

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toast
        open={open}
        title={props?.title}
        description={props?.description}
        variant={props?.variant}
        onClose={dismiss}
      />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}

