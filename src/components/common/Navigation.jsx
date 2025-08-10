import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Build as BuildIcon,
  Preview as PreviewIcon,
  List as ListIcon,
} from '@mui/icons-material'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const tabs = [
    { label: 'Create', value: '/create', icon: <BuildIcon /> },
    { label: 'Preview', value: '/preview', icon: <PreviewIcon /> },
    { label: 'My Forms', value: '/myforms', icon: <ListIcon /> },
  ]

  const currentTab = tabs.findIndex(tab => tab.value === location.pathname)
  const activeTab = currentTab >= 0 ? currentTab : 0

  const handleTabChange = (event, newValue) => {
    navigate(tabs[newValue].value)
  }

  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
      <Toolbar>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: 'primary.main',
          }}
        >
          {isMobile ? 'Form Builder' : 'Dynamic Form Builder'}
        </Typography>
        
        <Box>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={isMobile ? undefined : tab.label}
                icon={tab.icon}
                iconPosition={isMobile ? "top" : "start"}
                sx={{
                  minWidth: isMobile ? 60 : 120,
                  '& .MuiTab-iconWrapper': {
                    marginRight: isMobile ? 0 : 1,
                    marginBottom: isMobile ? 0.5 : 0,
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation