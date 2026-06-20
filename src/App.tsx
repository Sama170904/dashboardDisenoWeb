import './App.css'
import { useMemo, useState } from 'react'
import {
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  TextField,
  Button,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import Header from './Header'
import Indicadores from './Indicadores'
import Tabla from './Tabla'
import Alert from './Alert'
import { songs } from './data/spotifyData'

function App() {
  // --- ESTADO (useState) ---
  // useState se utiliza para almacenar valores que pueden cambiar con la interacción del usuario
  // y que deben provocar que React vuelva a renderizar la interfaz con los nuevos datos.
  const [genreFilter, setGenreFilter] = useState('Todos') // Filtro de género musical
  const [searchTerm, setSearchTerm] = useState('') // Filtro de búsqueda por texto

  // --- MEMOIZACIÓN (useMemo) ---
  // useMemo cachea cálculos costosos para que no se repitan en cada renderizado de la página,
  // mejorando el rendimiento. Solo se recalcula cuando cambian sus dependencias.

  // Lista única de géneros para el Selector. Se calcula una sola vez al montar.
  const genres = useMemo(
    () => ['Todos', ...Array.from(new Set(songs.map((song) => song.genre)))],
    [],
  )

  const clearFilters = () => {
    setGenreFilter('Todos')
    setSearchTerm('')
  }

  // Filtra las canciones según el género seleccionado Y la búsqueda por texto.
  // Se recalcula solo si cambian 'genreFilter' o 'searchTerm'.
  const filteredSongs = useMemo(() => {
    let result = songs

    if (genreFilter !== 'Todos') {
      result = result.filter((song) => song.genre === genreFilter)
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (song) =>
          song.name.toLowerCase().includes(term) ||
          song.artists.toLowerCase().includes(term)
      )
    }

    return result
  }, [genreFilter, searchTerm])

  const totalArtists = useMemo(
    () =>
      new Set(
        filteredSongs.flatMap((song) => song.artists.split(',').map((artist) => artist.trim())),
      ).size,
    [filteredSongs],
  )

  const totalGenres = useMemo(
    () => new Set(filteredSongs.map((song) => song.genre)).size,
    [filteredSongs],
  )

  const explicitCount = useMemo(
    () => filteredSongs.filter((song) => song.explicit).length,
    [filteredSongs],
  )

  const averageDuration = useMemo(
    () =>
      filteredSongs.length > 0
        ? filteredSongs.reduce((sum, song) => sum + song.duration_ms, 0) / filteredSongs.length / 60000
        : 0,
    [filteredSongs],
  )

  const averagePopularity = useMemo(
    () =>
      filteredSongs.length > 0
        ? filteredSongs.reduce((sum, song) => sum + song.popularity, 0) / filteredSongs.length
        : 0,
    [filteredSongs],
  )

  const topGenres = useMemo(() => {
    const counts = filteredSongs.reduce<Record<string, number>>((acc, song) => {
      acc[song.genre] = (acc[song.genre] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [filteredSongs])

  const topSongs = useMemo(
    () => [...filteredSongs].sort((a, b) => b.popularity - a.popularity).slice(0, 5),
    [filteredSongs],
  )

  const genreChartData = useMemo(() => {
    const counts = filteredSongs.reduce<Record<string, number>>((acc, song) => {
      acc[song.genre] = (acc[song.genre] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([genre, count]) => ({ genre, count }))
  }, [filteredSongs])

  const explicitChartData = useMemo(
    () => [
      { name: 'Explícitas', value: explicitCount },
      { name: 'No explícitas', value: filteredSongs.length - explicitCount },
    ],
    [explicitCount, filteredSongs.length],
  )

  const chartColors = ['#38bdf8', '#a78bfa', '#818cf8', '#fb7185', '#f59e0b', '#22c55e']
  const explicitColors = ['#22c55e', '#64748b']

  const summaryCards = [
    {
      title: 'Canciones filtradas',
      value: filteredSongs.length,
      accent: 'rgba(34, 211, 238, 0.92)',
      description: 'Visualiza el tamaño actual de la muestra según el filtro.',
    },
    {
      title: 'Artistas únicos',
      value: totalArtists,
      accent: 'rgba(168, 85, 247, 0.92)',
      description: 'El alcance artístico dentro del dataset filtrado.',
    },
    {
      title: 'Géneros distintos',
      value: totalGenres,
      accent: 'rgba(239, 68, 68, 0.92)',
      description: 'Número de estilos musicales distintos en la selección actual.',
    },
    {
      title: 'Popularidad media',
      value: averagePopularity.toFixed(1),
      accent: 'rgba(56, 189, 248, 0.92)',
      description: 'Conoce la fuerza promedio de las canciones seleccionadas.',
    },
  ]

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background:
          'radial-gradient(circle at 20% 10%, rgba(56, 189, 248, 0.16), transparent 18%), radial-gradient(circle at 85% 5%, rgba(168, 85, 247, 0.12), transparent 22%), linear-gradient(180deg, #06111f 0%, #0d1729 100%)',
        minHeight: '100vh',
        color: '#e2e8f0',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 5,
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1px solid rgba(148, 163, 184, 0.18)',
          boxShadow: '0 38px 90px rgba(0, 0, 0, 0.35)',
          p: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top left, rgba(59, 130, 246, 0.14), transparent 22%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.14), transparent 20%)',
            pointerEvents: 'none',
          }}
        />

        <Header
          title="Dashboard de Spotify"
          subtitle="Métricas visuales, filtros dinámicos y datos musicales en una interfaz elegante."
        />

        <Typography
          variant="body1"
          sx={{
            maxWidth: 760,
            mx: 'auto',
            textAlign: 'center',
            color: 'rgba(226, 232, 240, 0.88)',
          }}
        >
          Proyecto Rolando Samaniego Desarrollo de aplicaciones web
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 3 }}>
          <Chip
            label="Interfaz corporativa"
            sx={{ backgroundColor: 'rgba(56, 189, 248, 0.16)', color: 'white' }}
          />
          <Chip
            label="Análisis de datos"
            sx={{ backgroundColor: 'rgba(168, 85, 247, 0.16)', color: 'white' }}
          />
          <Chip
            label="Filtro por género"
            sx={{ backgroundColor: 'rgba(34, 211, 238, 0.16)', color: 'white' }}
          />
          <Chip
            label="Métricas clave"
            sx={{ backgroundColor: 'rgba(147, 197, 253, 0.14)', color: 'white' }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          mt: 3,
        }}
      >
        {summaryCards.map((card) => (
          <Paper
            key={card.title}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.16)',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.18)',
            }}
          >
            <Typography variant="subtitle2" sx={{ color: 'rgba(203, 213, 225, 0.88)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {card.title}
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, color: card.accent, fontWeight: 700 }}>
              {card.value}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'rgba(226, 232, 240, 0.78)' }}>
              {card.description}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', lg: '1.05fr 0.95fr' },
          mt: 3,
        }}
      >
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: '#0f1726',
            boxShadow: '0 24px 68px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 600 }}>
            Controles de Filtrado
          </Typography>

          {/* Barra de búsqueda por texto */}
          <TextField
            fullWidth
            label="Buscar por título o artista"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              backgroundColor: '#111827',
              borderRadius: 1,
              '& .MuiInputBase-input': { color: '#e2e8f0' },
              '& .MuiInputLabel-root': { color: '#cbd5e1' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#38bdf8' },
              },
            }}
          />

          {/* Selector de Género */}
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#cbd5e1' }}>Género</InputLabel>
            <Select
              value={genreFilter}
              label="Género"
              onChange={(event: SelectChangeEvent<string>) => setGenreFilter(event.target.value)}
              sx={{
                backgroundColor: '#111827',
                color: '#e2e8f0',
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.4)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' },
              }}
            >
              {genres.map((genre) => (
                <MenuItem key={genre} value={genre} sx={{ color: '#e2e8f0' }}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Chips informativos */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip label={`Géneros: ${totalGenres}`} color="primary" sx={{ fontWeight: 700, backgroundColor: '#1e293b' }} />
            <Chip label={`Explícitas: ${explicitCount}`} color="primary" sx={{ fontWeight: 700, backgroundColor: '#1e293b' }} />
            <Chip label={`Duración media: ${averageDuration.toFixed(2)} min`} color="primary" sx={{ fontWeight: 700, backgroundColor: '#1e293b' }} />
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={clearFilters}
            sx={{ mt: 2, backgroundColor: '#2563eb', '&:hover': { backgroundColor: '#1d4ed8' } }}
          >
            Restablecer filtros
          </Button>
        </Paper>

        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: '#0f1726',
            boxShadow: '0 24px 68px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
          }}
        >
          <Indicadores data={filteredSongs} />
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, mt: 3 }}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: '#111827',
            boxShadow: '0 24px 68px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#f8fafc' }}>
            Géneros más frecuentes
          </Typography>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {topGenres.map(([genre, count]) => (
              <Paper
                key={genre}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid rgba(96, 165, 250, 0.15)',
                  background: '#0b1220',
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#38bdf8' }}>
                  {genre}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: '#f8fafc' }}>
                  {count} canciones
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>

        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: '#111827',
            boxShadow: '0 24px 68px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#f8fafc' }}>
            Top 5 canciones
          </Typography>
          <Box component="ol" sx={{ pl: 3, m: 0, color: '#cbd5e1' }}>
            {topSongs.length === 0 ? (
              <Typography>No hay canciones con este filtro.</Typography>
            ) : (
              topSongs.map((song) => (
                <li key={song.id} style={{ marginBottom: '10px' }}>
                  <Typography sx={{ fontWeight: 600, color: '#f8fafc' }}>{song.name}</Typography>
                  <Typography sx={{ fontSize: '0.95rem', color: '#94a3b8' }}>
                    {song.artists} • Popularidad {song.popularity}
                  </Typography>
                </li>
              ))
            )}
          </Box>
        </Paper>
      </Box>

      {filteredSongs.length === 0 ? (
        <Box sx={{ mt: 3 }}>
          {/* Usamos el componente Alert importado si no hay resultados para alertar al usuario */}
          <Alert message="No se encontraron canciones que coincidan con los filtros o la búsqueda." />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, mt: 3 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: '#111827',
                boxShadow: '0 24px 68px rgba(15, 23, 42, 0.35)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#f8fafc' }}>
                Distribución de géneros
              </Typography>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreChartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.16)" />
                    <XAxis dataKey="genre" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0b1220', borderRadius: 10, borderColor: '#334155' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                    <Bar dataKey="count" name="Canciones" radius={[8, 8, 0, 0]}>
                      {genreChartData.map((entry, index) => (
                        <Cell key={entry.genre} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                backgroundColor: '#111827',
                boxShadow: '0 24px 68px rgba(15, 23, 42, 0.35)',
                border: '1px solid rgba(148, 163, 184, 0.12)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#f8fafc' }}>
                Contenido explícito
              </Typography>
              <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={explicitChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={4}
                      label={(props) => {
                        const name = props.name ?? 'Valor'
                        const percent = props.percent ?? 0
                        return `${name}: ${(percent * 100).toFixed(0)}%`
                      }}
                      labelLine={false}
                    >
                      {explicitChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={explicitColors[index % explicitColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0b1220', borderRadius: 10, borderColor: '#334155' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          <Paper
            sx={{
              p: 3,
              mt: 3,
              borderRadius: 4,
              backgroundColor: '#0f1726',
              boxShadow: '0 24px 68px rgba(15, 23, 42, 0.35)',
              border: '1px solid rgba(148, 163, 184, 0.12)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: '#f8fafc' }}>
              Tabla completa de canciones
            </Typography>
            <Tabla rows={filteredSongs} />
          </Paper>
        </>
      )}
    </Box>
  )
}

export default App
