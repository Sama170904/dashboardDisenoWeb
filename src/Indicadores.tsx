import { Box, Paper, Typography } from '@mui/material'
import type { Song } from './data/spotifyData'

function Indicadores(props: { data: Song[] }) {
  const { data } = props

  const totalCanciones = data.length
  const totalArtistas = new Set(
    data.flatMap((song) => song.artists.split(',').map((artist) => artist.trim())),
  ).size

  const generoMasPopular = data.reduce((acc, song) => {
    acc[song.genre] = (acc[song.genre] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topGenre = Object.entries(generoMasPopular).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Sin datos'

  const popularidadPromedio =
    totalCanciones > 0
      ? data.reduce((sum, song) => sum + song.popularity, 0) / totalCanciones
      : 0

  const duracionPromedio =
    totalCanciones > 0
      ? data.reduce((sum, song) => sum + song.duration_ms, 0) / totalCanciones / 60000
      : 0

  const cantidadExplicitas = data.filter((song) => song.explicit).length

  const cards = [
    {
      label: 'Canciones',
      value: totalCanciones,
      accent: '#7dd3fc',
    },
    {
      label: 'Artistas',
      value: totalArtistas,
      accent: '#c084fc',
    },
    {
      label: 'Género más popular',
      value: topGenre,
      accent: '#38bdf8',
    },
    {
      label: 'Popularidad media',
      value: popularidadPromedio.toFixed(1),
      accent: '#60a5fa',
    },
    {
      label: 'Duración promedio',
      value: `${duracionPromedio.toFixed(2)} min`,
      accent: '#f472b6',
    },
    {
      label: 'Explícitas',
      value: cantidadExplicitas,
      accent: '#fb7185',
    },
  ]

  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
      <Typography variant="h6" sx={{ color: '#f8fafc', mb: 2 }}>
        Resumen de datos
      </Typography>
      <Box sx={{ display: 'grid', gap: 2, gridColumn: 'span 2' }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: '#0b1220',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            boxShadow: '0 22px 54px rgba(15, 23, 42, 0.2)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1 }}>
            Observaciones
          </Typography>
          <Typography sx={{ color: 'rgba(226, 232, 240, 0.88)' }}>
            El género más popular te ayuda a identificar las preferencias principales del conjunto filtrado. Revisa los valores y busca oportunidades para explorar tendencias musicales.
          </Typography>
        </Paper>
      </Box>
      {cards.map((card) => (
        <Paper
          key={card.label}
          sx={{
            p: 3,
            borderRadius: 4,
            background: '#0f1726',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            boxShadow: '0 22px 54px rgba(15, 23, 42, 0.18)',
          }}
        >
          <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {card.label}
          </Typography>
          <Typography variant="h4" sx={{ color: card.accent, mt: 1, fontWeight: 700 }}>
            {card.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  )
}

export default Indicadores
