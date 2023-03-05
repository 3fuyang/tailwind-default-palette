import type { JSX } from 'solid-js'

interface BProps {
  title: string
  onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent>
}

export function Button(props: BProps) {
  return (
    <button
      type="button"
      class="rounded border border-neutral-300 px-1 text-xs font-semibold tracking-wide text-neutral-300 transition-colors duration-300 hover:border-sky-300 hover:text-sky-300 md:rounded-lg md:border-2 md:px-3 md:py-1 md:text-sm"
      onClick={props.onClick}
    >
      <slot>{props.title}</slot>
    </button>
  )
}
