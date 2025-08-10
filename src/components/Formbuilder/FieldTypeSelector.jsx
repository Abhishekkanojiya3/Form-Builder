import React from 'react'
import {
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material'
import {
  TextFields as TextIcon,
  Numbers as NumberIcon,
  Notes as TextareaIcon,
  ArrowDropDown as SelectIcon,
  RadioButtonChecked as RadioIcon,
  CheckBox as CheckboxIcon,
  DateRange as DateIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { FIELD_TYPES, FIELD_TYPE_CONFIG } from '../../utils/constants'

const FIELD_ICONS = {
  [FIELD_TYPES.TEXT]: TextIcon,
  [FIELD_TYPES.NUMBER]: NumberIcon,
  [FIELD_TYPES.TEXTAREA]: TextareaIcon,
  [FIELD_TYPES.SELECT]: SelectIcon,
  [FIELD_TYPES.RADIO]: RadioIcon,
  [FIELD_TYPES.CHECKBOX]: CheckboxIcon,
  [FIELD_TYPES.DATE]: DateIcon,
}

const FieldTypeSelector = ({ onAddField, disabled = false }) => {
  const handleAddField = (fieldType) => {
    if (!disabled && onAddField) {
      onAddField(fieldType)
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Add Field
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose a field type to add to your form
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {Object.entries(FIELD_TYPE_CONFIG).map(([fieldType, config]) => {
          const IconComponent = FIELD_ICONS[fieldType]
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={fieldType}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  transition: 'all 0.2s ease-in-out',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                  '&:hover': disabled ? {} : {
                    elevation: 3,
                    transform: 'translateY(-2px)',
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleAddField(fieldType)}
                  disabled={disabled}
                  sx={{ height: '100%', p: 2 }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 0, '&:last-child': { pb: 0 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: 'primary.100',
                          color: 'primary.main',
                          mb: 1,
                        }}
                      >
                        {IconComponent && <IconComponent />}
                      </Box>
                      
                      <Typography
                        variant="subtitle2"
                        fontWeight="medium"
                        textAlign="center"
                        sx={{ lineHeight: 1.2 }}
                      >
                        {config.label}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>
      
      {disabled && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="warning.main" textAlign="center">
            Maximum number of fields reached
          </Typography>
        </Box>
      )}
    </Paper>
  )
}

export default FieldTypeSelector