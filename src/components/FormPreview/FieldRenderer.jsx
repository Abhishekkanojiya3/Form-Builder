import React from 'react'
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  Checkbox,
  Typography,
  Box,
  FormHelperText,
} from '@mui/material'

const FieldRenderer = ({ 
  field, 
  value, 
  onChange, 
  error 
}) => {
  const commonProps = {
    fullWidth: true,
    error: !!error,
    disabled: field.isDerived,
  }

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(field.id, newValue)
    }
  }

  switch (field.type) {
    case 'text':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          type={field.validation?.password ? 'password' : 'text'}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          helperText={error || (field.isDerived ? 'This field is automatically calculated' : '')}
          required={field.required}
          placeholder={field.isDerived ? 'Auto-calculated' : undefined}
          InputProps={{
            readOnly: field.isDerived,
          }}
        />
      )
    
    case 'number':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          type="number"
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          helperText={error || (field.isDerived ? 'This field is automatically calculated' : '')}
          required={field.required}
          placeholder={field.isDerived ? 'Auto-calculated' : undefined}
          InputProps={{
            readOnly: field.isDerived,
            inputProps: {
              min: field.validation?.minValue,
              max: field.validation?.maxValue,
            },
          }}
        />
      )
    
    case 'textarea':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          multiline
          rows={4}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          helperText={error || (field.isDerived ? 'This field is automatically calculated' : '')}
          required={field.required}
          placeholder={field.isDerived ? 'Auto-calculated' : undefined}
          InputProps={{
            readOnly: field.isDerived,
          }}
        />
      )
    
    case 'select':
      return (
        <FormControl fullWidth error={!!error} disabled={field.isDerived}>
          <InputLabel required={field.required}>
            {field.label}
          </InputLabel>
          <Select
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            label={field.label}
          >
            <MenuItem value="">
              <em>Select an option</em>
            </MenuItem>
            {field.options?.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {(error || field.isDerived) && (
            <FormHelperText>
              {error || 'This field is automatically calculated'}
            </FormHelperText>
          )}
        </FormControl>
      )
    
    case 'radio':
      return (
        <FormControl 
          error={!!error} 
          disabled={field.isDerived}
          sx={{ width: '100%' }}
        >
          <FormLabel required={field.required}>
            {field.label}
          </FormLabel>
          <RadioGroup
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            sx={{ mt: 1 }}
          >
            {field.options?.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option.value}
                control={<Radio />}
                label={option.label}
                disabled={field.isDerived}
              />
            ))}
          </RadioGroup>
          {(error || field.isDerived) && (
            <FormHelperText>
              {error || 'This field is automatically calculated'}
            </FormHelperText>
          )}
        </FormControl>
      )
    
    case 'checkbox':
      return (
        <Box sx={{ width: '100%' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={value || false}
                onChange={(e) => handleChange(e.target.checked)}
                disabled={field.isDerived}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>
                  {field.label}
                  {field.required && (
                    <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                      *
                    </Typography>
                  )}
                </Typography>
              </Box>
            }
            sx={{ 
              width: '100%',
              alignItems: 'flex-start',
              '& .MuiFormControlLabel-label': {
                width: '100%'
              }
            }}
          />
          {(error || field.isDerived) && (
            <Typography
              variant="caption"
              color={error ? 'error.main' : 'text.secondary'}
              sx={{ ml: 4, display: 'block' }}
            >
              {error || 'This field is automatically calculated'}
            </Typography>
          )}
        </Box>
      )
    
    case 'date':
      return (
        <TextField
          {...commonProps}
          label={field.label}
          type="date"
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          helperText={error || (field.isDerived ? 'This field is automatically calculated' : '')}
          required={field.required}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            readOnly: field.isDerived,
          }}
        />
      )
    
    default:
      return (
        <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
          <Typography color="error">
            Unknown field type: {field.type}
          </Typography>
        </Box>
      )
  }
}

export default FieldRenderer