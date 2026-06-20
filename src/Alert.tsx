import { Box, Typography } from '@mui/material'

function Alert(props: { message: string }) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        p: 3,
        backgroundColor: '#0b1220',
        color: 'rgba(226, 232, 240, 0.96)',
        borderRadius: 3,
        border: '1px solid rgba(56, 189, 248, 0.24)',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#38bdf8' }}>
        Aviso
      </Typography>
      <Typography>{props.message}</Typography>
    </Box>
  )
}

export default Alert;