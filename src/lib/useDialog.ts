import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea,select,[tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal-dialog behaviour: locks body scroll, focuses the first
 * focusable element on open, traps Tab inside the dialog, closes on Escape,
 * and restores focus to the trigger on close. Attach the returned ref to the
 * dialog's container element.
 */
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    const node = ref.current
    const list = () =>
      node
        ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.offsetParent !== null || el === document.activeElement,
          )
        : []

    // focus the first focusable element (or the dialog itself)
    const id = window.setTimeout(() => {
      const first = list()[0]
      ;(first ?? node)?.focus()
    }, 60)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab' && node) {
        const f = list()
        if (f.length === 0) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(id)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      restoreTo.current?.focus?.()
    }
  }, [open, onClose])

  return ref
}
