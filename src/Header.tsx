import { Box, Typography } from '@mui/material'

function Header(props: { title: string; subtitle?: string }) {
  const { title, subtitle } = props

  return (
    <Box sx={{ textAlign: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: '#f8fafc',
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'rgba(226, 232, 240, 0.82)', maxWidth: 760, mx: 'auto' }}>
        {subtitle ?? 'Análisis de datos musicales usando React y TypeScript.'}
      </Typography>
    </Box>
  )
}

export default Header
