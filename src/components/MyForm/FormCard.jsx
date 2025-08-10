import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Preview as PreviewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material'
import { FIELD_TYPE_CONFIG } from '../../utils/constants'

const FormCard = ({ 
  form, 
  onPreview, 
  onEdit, 
  onDelete 
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const menuOpen = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    handleMenuClose()
    if (onDelete) {
      onDelete(form.id)
    }
  }

  const getFieldTypeCount = () => {
    const typeCounts = {}
    form.fields?.forEach(field => {
      typeCounts[field.type] = (typeCounts[field.type] || 0) + 1
    })
    return typeCounts
  }

  const fieldTypeCounts = getFieldTypeCount()
  const requiredFieldsCount = form.fields?.filter(field => field.required).length || 0
  const derivedFieldsCount = form.fields?.filter(field => field.isDerived).length || 0

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {form.name}
          </Typography>
          <IconButton 
            size="small" 
            onClick={handleMenuClick}
            sx={{ ml: 1 }}
          >
            <MoreIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Created: {new Date(form.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            <strong>{form.fields?.length || 0}</strong> field{form.fields?.length !== 1 ? 's' : ''}
            {requiredFieldsCount > 0 && (
              <> • <strong>{requiredFieldsCount}</strong> required</>
            )}
            {derivedFieldsCount > 0 && (
              <> • <strong>{derivedFieldsCount}</strong> derived</>
            )}
          </Typography>
        </Box>
        
        {/* Field Type Chips */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
          {Object.entries(fieldTypeCounts).slice(0, 4).map(([fieldType, count]) => (
            <Chip
              key={fieldType}
              label={`${FIELD_TYPE_CONFIG[fieldType]?.label || fieldType} ${count > 1 ? `(${count})` : ''}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
          {Object.keys(fieldTypeCounts).length > 4 && (
            <Chip
              label={`+${Object.keys(fieldTypeCounts).length - 4} more`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          )}
        </Box>

        {/* Form Stats */}
        {form.fields && form.fields.length > 0 && (
          <Box sx={{ mt: 'auto' }}>
            <Typography variant="caption" color="text.secondary">
              Field types: {Object.keys(fieldTypeCounts).join(', ')}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<PreviewIcon />}
          onClick={() => onPreview && onPreview(form)}
          variant="outlined"
        >
          Preview
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => onEdit && onEdit(form)}
          variant="contained"
        >
          Edit
        </Button>
      </CardActions>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete Form
        </MenuItem>
      </Menu>
    </Card>
  )
}

export default FormCard