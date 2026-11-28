import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/** False during prerender and hydration, true afterwards. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
