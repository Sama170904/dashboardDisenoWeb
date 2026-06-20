import spotifyCsv from './spotify_tracks.csv?raw'

export type Song = {
  id: string
  name: string
  genre: string
  artists: string
  album: string
  popularity: number
  duration_ms: number
  explicit: boolean
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = []
  let current: string = ''
  let row: string[] = []
  let inQuotes = false

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i]

    if (char === '"') {
      if (inQuotes && i + 1 < csv.length && csv[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(current)
      current = ''
      continue
    }

    if (char === '\r') {
      continue
    }

    if (char === '\n' && !inQuotes) {
      row.push(current)
      rows.push(row)
      row = []
      current = ''
      continue
    }

    current += char
  }

  if (current !== '' || row.length > 0) {
    row.push(current)
    rows.push(row)
  }

  return rows
}

function parseBoolean(value: string) {
  return value.trim().toLowerCase() === 'true'
}

const csvRows = parseCsv(spotifyCsv)
const [header, ...dataRows] = csvRows.filter((row) => row.length > 0 && row.some((cell) => cell.trim() !== ''))
const headerIndex = Object.fromEntries(header.map((col, index) => [col.trim(), index]))

export const songs: Song[] = dataRows
  .filter((row) => row.length >= header.length)
  .map((row) => ({
    id: row[headerIndex.id] ?? '',
    name: row[headerIndex.name] ?? '',
    genre: row[headerIndex.genre] ?? '',
    artists: row[headerIndex.artists] ?? '',
    album: row[headerIndex.album] ?? '',
    popularity: Number(row[headerIndex.popularity] ?? 0),
    duration_ms: Number(row[headerIndex.duration_ms] ?? 0),
    explicit: parseBoolean(row[headerIndex.explicit] ?? 'False'),
  }))
