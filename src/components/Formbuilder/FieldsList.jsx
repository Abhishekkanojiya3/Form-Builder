import React from 'react'
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material'
import {
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
} from '@mui/icons-material'
import { FIELD_TYPE_CONFIG } from '../../utils/constants'

const FieldList = ({ 
  fields, 
  onEditField, 
  onDeleteField, 
  onMoveField
}) => {
  const handleMoveUp = (fieldId, index) => {
    if (index > 0 && onMoveField) {
      onMoveField(fieldId, 'up')
    }
  }

  const handleMoveDown = (fieldId, index) => {
    if (index < fields.length - 1 && onMoveField) {
      onMoveField(fieldId, 'down')
    }
  }

  if (fields.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Form Fields
        </Typography>
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No fields added yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by adding a field from the options above
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Form Fields ({fields.length})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure and reorder your form fields
        </Typography>
      </Box>

      <List disablePadding>
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <ListItem
              sx={{
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 1,
                mb: 1,
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'grey.50',
                },
              }}
            >
              {/* Drag Handle */}
              <Tooltip title="Drag to reorder">
                <DragIcon 
                  sx={{ 
                    mr: 2, 
                    color: 'text.secondary', 
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' }
                  }} 
                />
              </Tooltip>

              {/* Field Info */}
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {field.label}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {field.required && (
                        <Chip 
                          label="Required" 
                          size="small" 
                          color="error" 
                          variant="outlined"
                        />
                      )}
                      {field.isDerived && (
                        <Chip 
                          label="Derived" 
                          size="small" 
                          color="info" 
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {FIELD_TYPE_CONFIG[field.type]?.label} • ID: {field.id}
                    </Typography>
                    {field.validation && Object.keys(field.validation).length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        Validations: {Object.keys(field.validation).join(', ')}
                      </Typography>
                    )}
                  </Box>
                }
              />

              {/* Actions */}
              <ListItemSecondaryAction>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {/* Move Up */}
                  <Tooltip title="Move up">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleMoveUp(field.id, index)}
                        disabled={index === 0}
                        sx={{ color: 'primary.main' }}
                      >
                        <UpIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  {/* Move Down */}
                  <Tooltip title="Move down">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleMoveDown(field.id, index)}
                        disabled={index === fields.length - 1}
                        sx={{ color: 'primary.main' }}
                      >
                        <DownIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  {/* Edit */}
                  <Tooltip title="Edit field">
                    <IconButton
                      size="small"
                      onClick={() => onEditField && onEditField(field)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  {/* Delete */}
                  <Tooltip title="Delete field">
                    <IconButton
                      size="small"
                      onClick={() => onDeleteField && onDeleteField(field.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  )
}

export default FieldList