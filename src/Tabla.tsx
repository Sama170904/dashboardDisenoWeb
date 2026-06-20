import { useState, useEffect } from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination, // Importamos TablePagination para manejar grandes volúmenes de datos
} from '@mui/material'
import type { Song } from './data/spotifyData'

function Tabla(props: { rows: Song[] }) {
  const { rows } = props

  // --- ESTADO LOCAL PARA PAGINACIÓN ---
  // Guardamos la página actual (empezando en 0) y el número de filas por página
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Si las filas filtradas cambian (por ejemplo, al escribir en el buscador),
  // reiniciamos a la página 0 para evitar quedar en una página inexistente.
  useEffect(() => {
    setPage(0)
  }, [rows])

  // Manejador de cambio de página
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  // Manejador de cambio del número de filas por página
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Obtenemos solo el subconjunto de filas correspondientes a la página actual
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: '#0f1726',
        color: '#e2e8f0',
        border: '1px solid rgba(148, 163, 184, 0.12)',
      }}
    >
      <TableContainer sx={{ maxHeight: 520 }}>
        <Table
          stickyHeader
          sx={{
            minWidth: 680,
            '& .MuiTableCell-root': {
              color: '#e2e8f0',
              borderColor: 'rgba(148, 163, 184, 0.12)',
            },
            '& .MuiTableCell-head': {
              color: '#93c5fd',
              fontWeight: 700,
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
            },
            '& .MuiTableRow-root:nth-of-type(odd)': {
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
            },
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Canción</TableCell>
              <TableCell>Artista</TableCell>
              <TableCell>Género</TableCell>
              <TableCell>Álbum</TableCell>
              <TableCell align="right">Popularidad</TableCell>
              <TableCell align="right">Duración (min)</TableCell>
              <TableCell align="center">Explícito</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((song) => (
              <TableRow key={song.id} hover>
                <TableCell>{song.name}</TableCell>
                <TableCell>{song.artists}</TableCell>
                <TableCell>{song.genre}</TableCell>
                <TableCell>{song.album}</TableCell>
                <TableCell align="right">{song.popularity}</TableCell>
                <TableCell align="right">{(song.duration_ms / 60000).toFixed(2)}</TableCell>
                <TableCell align="center">{song.explicit ? 'Sí' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Control de paginación al final de la tabla */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: '#cbd5e1',
          mt: 1,
          '& .MuiTablePagination-selectIcon': { color: '#cbd5e1' },
          '& .MuiTablePagination-actions': { color: '#cbd5e1' },
        }}
      />
    </Paper>
  )
}

export default Tabla
