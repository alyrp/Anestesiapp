"use client"

// Adapted from shadcn/ui toast component
import { useState, useEffect, useCallback } from "react"

export type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type ToastState = {
  open: boolean
  props: ToastProps | null
}

export function useToast() {
  const [state, setState] = useState<ToastState>({
    open: false,
    props: null,
  })

  const toast = useCallback((props: ToastProps) => {
    setState({
      open: true,
      props,
    })
  }, [])

  const dismiss = useCallback(() => {
    setState((prev) => ({
      ...prev,
      open: false,
    }))
  }, [])

  useEffect(() => {
    if (state.open && state.props?.duration) {
      const timer = setTimeout(() => {
        dismiss()
      }, state.props.duration)

      return () => clearTimeout(timer)
    }
  }, [state.open, state.props?.duration, dismiss])

  return {
    toast,
    dismiss,
    ...state,
  }
}

