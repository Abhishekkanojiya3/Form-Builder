import React from 'react'
import { Box } from '@mui/material'
import Navigation from './Navigation'

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: (theme) => theme.palette.grey[50],
          minHeight: 'calc(100vh - 64px)', // Subtract header height
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

export default Layout