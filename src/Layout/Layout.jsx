import { Box } from '@mui/material'
import React from 'react'
import DashboardSidebar from '../components/DashboardSidebar'

const Layout = ({children}) => {
  return (
    <Box display={'flex'}>
        <Box minHeight={'100vh'} display={'flex'} >
            <DashboardSidebar/>
        </Box>
        <Box sx={{  px: 3, py: 2 }}>
            {children}
        </Box>
    </Box>
  )
}

export default Layout