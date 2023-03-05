import { mergeProps } from 'solid-js'

interface PProps {
  title: string
  railColor?: string
  fillColor?: string
  fillArc: number
  strokeWidth?: number
}

const RADIUS = 22
export const ROUND = 2 * Math.PI * RADIUS

export function Progress(_props: PProps) {
  const props = mergeProps(
    { railColor: '#a3a3a3', fillColor: '#14b8a6', strokeWidth: 4 },
    _props
  )

  return (
    <div class="relative aspect-square w-8 md:w-12">
      {/* Inner Text */}
      <div
        class="absolute inset-0 flex items-center justify-center text-sm md:text-lg"
        style={{ color: props.fillColor }}
      >
        {props.title}
      </div>
      {/* Visualization Ring */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        class="absolute inset-0"
      >
        {/* Rail */}
        <g class="opacity-30">
          <path
            fill="none"
            stroke={props.railColor}
            stroke-width={props.strokeWidth}
            d="M 24,24 m 0,-22 a 22,22 0 1 1 0,44 a 22,22 0 1 1 0,-44"
          />
        </g>
        {/* Fill */}
        <g>
          <path
            fill="none"
            data-progress="fill"
            stroke={props.fillColor}
            stroke-width={props.strokeWidth}
            style={{
              'stroke-dasharray': `${props.fillArc} ${ROUND - props.fillArc}`,
            }}
            d="M 24,24 m 0,-22 a 22,22 0 1 1 0,44 a 22,22 0 1 1 0,-44"
          />
        </g>
      </svg>
    </div>
  )
}
