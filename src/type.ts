export type ColorScheme =
  | 'Slate'
  | 'Gray'
  | 'Zinc'
  | 'Neutral'
  | 'Stone'
  | 'Red'
  | 'Orange'
  | 'Amber'
  | 'Yellow'
  | 'Lime'
  | 'Green'
  | 'Emerald'
  | 'Teal'
  | 'Cyan'
  | 'Sky'
  | 'Blue'
  | 'Indigo'
  | 'Violet'
  | 'Purple'
  | 'Fuchsia'
  | 'Pink'
  | 'Rose'

export interface PaletteRow {
  scheme: ColorScheme
  cells: string[]
}

export interface ColorModelMeta {
  name: string
  initialText: string
  fillColor: string
}
