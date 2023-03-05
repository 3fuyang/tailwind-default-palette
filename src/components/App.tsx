import { createEffect, createMemo, createSignal } from 'solid-js'

import type { ColorModelMeta } from 'src/type'
import { colors } from 'src/model'
import { Progress, ROUND } from './Progress'
import { Button } from './Button'

/** Metadata of the CMYK color model. */
const CMYK: ColorModelMeta[] = [
  {
    name: 'C',
    initialText: '0',
    fillColor: '#06b6d4',
  },
  {
    name: 'M',
    initialText: '0',
    fillColor: '#f43f5e',
  },
  {
    name: 'Y',
    initialText: '0',
    fillColor: '#facc15',
  },
  {
    name: 'K',
    initialText: '0',
    fillColor: '#111827',
  },
]

/** Metadata of the RGB color model. */
const RGB: ColorModelMeta[] = [
  {
    name: 'R',
    initialText: '255',
    fillColor: '#dc2626',
  },
  {
    name: 'G',
    initialText: '255',
    fillColor: '#22c55e',
  },
  {
    name: 'B',
    initialText: '255',
    fillColor: '#2563eb',
  },
]

const colorMedelSystems = ['HEX', 'RGB', 'CMYK', 'HSL'] as const

export function App() {
  const [globalTheme, setGlobalTheme] = createSignal('#ffffff')
  const [themeTitle, setThemeTitle] = createSignal('Tailwind Default Palette')

  createEffect(() => {
    document.body.style.backgroundColor = globalTheme()
  })

  const cmykArcs = createMemo(() => {
    const [, cmyk] = hexToRgbAndCmyk(globalTheme().slice(1))

    return cmyk?.map((n) => ({
      title: '' + Math.floor(n * 100),
      arc: getStrokeFillArcLength(n, 1),
    }))
  })

  const rgbArcs = createMemo(() => {
    const [rgb] = hexToRgbAndCmyk(globalTheme().slice(1))

    return rgb?.map((n) => ({
      title: '' + Math.floor(n),
      arc: getStrokeFillArcLength(n, 255),
    }))
  })

  return (
    <div class="max-md:relative md:grid md:grid-cols-2">
      {/* Palette */}
      <div class="mt-48 flex flex-col gap-2 py-4 md:col-start-1 md:mt-0 md:h-screen md:overflow-auto">
        {/* Scheme Bar */}
        {colors.map(({ scheme, cells }) => (
          <div>
            {/* Scheme Title */}
            <h2
              id={scheme}
              class="mb-2 font-semibold tracking-wide max-md:scroll-mt-48"
            >
              <a href={`#${scheme}`}>{scheme}</a>
            </h2>
            {/* Scheme Cells */}
            <div class="grid grid-cols-5 gap-2 md:grid-cols-10">
              {cells.map((cell, i) => (
                <div>
                  <div
                    class="h-8 cursor-pointer rounded"
                    style={{ 'background-color': cell }}
                    onClick={() => {
                      setGlobalTheme(cell)
                      setThemeTitle(
                        `${scheme}-${transform(i)} (${cell.toUpperCase()})`
                      )
                    }}
                  />
                  <h3 class="mt-1 flex items-center justify-center truncate text-xs text-gray-600">
                    {transform(i)}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Preview */}
      <div class="flex flex-col items-center justify-center py-4 max-md:fixed max-md:top-0 max-md:left-0 max-md:right-0 max-md:border-b max-md:bg-white md:col-start-2 md:h-screen">
        {/* Card */}
        <div class="flex flex-col items-center justify-between gap-2 bg-white md:min-w-max md:gap-6 md:rounded-lg md:border md:py-6 md:px-10 md:shadow-xl">
          {/* Theme Title */}
          <h2
            id="currThemeTitle"
            class="font-mono text-lg tracking-wide text-black md:text-xl"
          >
            {themeTitle()}
          </h2>
          {/* Color Models */}
          {/* CMYK */}
          <div class="mt-3 flex gap-3 md:mt-0">
            {CMYK.map(({ name, initialText, fillColor }, i) => (
              <div class="flex items-center justify-center gap-2">
                <span
                  class="select-none text-sm opacity-60 md:text-lg"
                  style={{ color: fillColor }}
                >
                  {name}
                </span>
                <Progress
                  title={cmykArcs()?.[i]?.title || initialText}
                  fillColor={fillColor}
                  fillArc={cmykArcs()?.[i]?.arc || 0}
                  strokeWidth={2}
                />
              </div>
            ))}
          </div>
          {/* RGB */}
          <div class="flex gap-3">
            {RGB.map(({ name, initialText, fillColor }, i) => (
              <div class="flex items-center justify-center gap-2">
                <span
                  class="select-none text-sm opacity-80 md:text-lg"
                  style={{ color: fillColor }}
                >
                  {name}
                </span>
                <Progress
                  title={rgbArcs()?.[i]?.title || initialText}
                  fillColor={fillColor}
                  fillArc={rgbArcs()?.[i]?.arc || 0}
                  strokeWidth={2}
                />
              </div>
            ))}
          </div>
          {/* Actions */}
          <div class="mt-3 flex justify-center gap-4 md:mt-0">
            {colorMedelSystems.map((model) => (
              <Button
                title={model}
                onClick={async () => {
                  if (!navigator) {
                    return
                  }
                  await navigator.clipboard.writeText(
                    getColorModel(globalTheme(), model)
                  )
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Transform an index to the shade.
 * @param {number} i Index.
 * @returns The shade.
 */
function transform(i: number) {
  return i === 0 ? 50 : i * 100
}

/**
 * Get the value in specified color model system.
 */
function getColorModel(source: string, type: 'HEX' | 'RGB' | 'CMYK' | 'HSL') {
  // Remove the '#' character from the source color if it is present
  source = source.replace('#', '')

  // Convert the source color from HEX to RGB
  let r = parseInt(source.substring(0, 2), 16)
  let g = parseInt(source.substring(2, 4), 16)
  let b = parseInt(source.substring(4, 6), 16)

  // Calculate the CMYK values
  let c = 1 - r / 255
  let m = 1 - g / 255
  let y = 1 - b / 255
  const k = Math.min(c, m, y)
  c = (c - k) / (1 - k)
  m = (m - k) / (1 - k)
  y = (y - k) / (1 - k)

  // Calculate the HSL values
  let h = -Infinity,
    s: number

  ;(r /= 255), (g /= 255), (b /= 255)
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  if (max === min) {
    h = 0
  } else if (max === r) {
    h = (60 * ((g - b) / (max - min))) % 360
  } else if (max === g) {
    h = (60 * ((b - r) / (max - min)) + 120) % 360
  } else if (max === b) {
    h = (60 * ((r - g) / (max - min)) + 240) % 360
  }
  if (h < 0) {
    h += 360
  }
  const l = (max + min) / 2
  if (max === min) {
    s = 0
  } else if (l <= 0.5) {
    s = (max - min) / (2 * l)
  } else {
    s = (max - min) / (2 - 2 * l)
  }

  // Determine the output format based on the type argument
  switch (type) {
    case 'HEX':
      return '#' + source.toUpperCase()
    case 'RGB':
      return `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(
        b * 255
      )})`
    case 'CMYK':
      return `cmyk(${Math.floor(c * 100)}, ${Math.floor(m * 100)}, ${Math.floor(
        y * 100
      )}, ${Math.floor(k * 100)})`
    case 'HSL':
      return `hsl(${Math.floor(h)}, ${Math.floor(s * 100)}%, ${Math.floor(
        l * 100
      )}%)`
    default:
      throw new Error('Invalid type argument')
  }
}

/**
 * Convert HEX to RGB and CMYK.
 */
function hexToRgbAndCmyk(hex: string) {
  // convert hex to RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // calculate the maximum of the RGB values
  const max = Math.max(r, g, b)

  // calculate the K value (key)
  const k = 1 - max

  // calculate the C value (cyan)
  const c = (1 - r - k) / (1 - k)

  // calculate the M value (magenta)
  const m = (1 - g - k) / (1 - k)

  // calculate the Y value (yellow)
  const y = (1 - b - k) / (1 - k)

  // return the CMYK values as an object
  return [
    [r * 255, g * 255, b * 255],
    [c, m, y, k],
  ]
}

/**
 * Get the length of the filled arc.
 */
function getStrokeFillArcLength(num: number, full: number) {
  return (num / full) * ROUND
}
