import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Alert,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { 
  FIELD_TYPES, 
  FIELD_TYPE_CONFIG, 
  DERIVED_FIELD_TYPES,
  DERIVED_FIELD_CONFIG 
} from '../../utils/constants'
import { getAvailableParentFields, validateDerivedFieldConfig } from '../../utils/derivedFields'

const FieldConfigPanel = ({ 
  open, 
  onClose, 
  field, 
  onSave, 
  allFields = [] 
}) => {
  const [config, setConfig] = useState({
    id: '',
    type: 'text',
    label: '',
    required: false,
    defaultValue: '',
    validation: {},
    isDerived: false,
    derivedConfig: null,
    options: []
  })
  console.log(field,"jnjnedjjedjned")
  const [validationExpanded, setValidationExpanded] = useState(false)
  const [derivedExpanded, setDerivedExpanded] = useState(false)
  const [errors, setErrors] = useState({})

  // Initialize config when field changes
  useEffect(() => {
    if (field) {
      setConfig({
        ...field,
        options: field.options || []
      })
    } else {
      setConfig({
        id: Date.now().toString(),
        type: 'text',
        label: '',
        required: false,
        defaultValue: '',
        validation: {},
        isDerived: false,
        derivedConfig: null,
        options: []
      })
    }
  }, [field])

  const handleSave = () => {
    // Validate config
    const newErrors = validateConfig()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(config)
    handleClose()
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  const validateConfig = () => {
    const newErrors = {}
    
    if (!config.label.trim()) {
      newErrors.label = 'Field label is required'
    }
    
    if (['select', 'radio'].includes(config.type) && config.options.length === 0) {
      newErrors.options = 'At least one option is required'
    }
    
    if (config.isDerived && config.derivedConfig) {
      const derivedErrors = validateDerivedFieldConfig(config.derivedConfig, allFields, config.id)
      if (derivedErrors.length > 0) {
        newErrors.derived = derivedErrors[0]
      }
    }
    
    return newErrors
  }

  const updateValidation = (key, value) => {
    setConfig(prev => ({
      ...prev,
      validation: { ...prev.validation, [key]: value }
    }))
  }

  const addOption = () => {
    setConfig(prev => ({
      ...prev,
      options: [...prev.options, { label: '', value: '' }]
    }))
  }

  const updateOption = (index, key, value) => {
    setConfig(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [key]: value } : opt
      )
    }))
  }

  const removeOption = (index) => {
    setConfig(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const availableParentFields = config.isDerived 
    ? getAvailableParentFields(config.derivedConfig?.type, allFields, config.id)
    : []

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        {field ? 'Edit Field' : 'Add New Field'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={3}>
            {/* Basic Configuration */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Configuration
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Field Type</InputLabel>
                <Select
                  value={config.type}
                  onChange={(e) => setConfig(prev => ({ 
                    ...prev, 
                    type: e.target.value,
                    options: ['select', 'radio'].includes(e.target.value) 
                      ? [{ label: 'Option 1', value: 'option1' }] 
                      : []
                  }))}
                  label="Field Type"
                >
                  {Object.entries(FIELD_TYPE_CONFIG).map(([type, typeConfig]) => (
                    <MenuItem key={type} value={type}>
                      {typeConfig.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Field Label"
                value={config.label}
                onChange={(e) => setConfig(prev => ({ ...prev, label: e.target.value }))}
                error={!!errors.label}
                helperText={errors.label}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.required}
                    onChange={(e) => setConfig(prev => ({ ...prev, required: e.target.checked }))}
                  />
                }
                label="Required Field"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Value"
                value={config.defaultValue}
                onChange={(e) => setConfig(prev => ({ ...prev, defaultValue: e.target.value }))}
                type={config.type === 'number' ? 'number' : 
                     config.type === 'date' ? 'date' : 'text'}
                InputLabelProps={config.type === 'date' ? { shrink: true } : undefined}
              />
            </Grid>

            {/* Options for Select/Radio */}
            {['select', 'radio'].includes(config.type) && (
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Options
                  </Typography>
                  {errors.options && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.options}
                    </Alert>
                  )}
                </Box>
                
                {config.options.map((option, index) => (
                  <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Option Label"
                        value={option.label}
                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Option Value"
                        value={option.value}
                        onChange={(e) => updateOption(index, 'value', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton 
                        onClick={() => removeOption(index)} 
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                
                <Button
                  onClick={addOption}
                  startIcon={<AddIcon />}
                  variant="outlined"
                  size="small"
                >
                  Add Option
                </Button>
              </Grid>
            )}

            {/* Validation Rules */}
            <Grid item xs={12}>
              <Accordion 
                expanded={validationExpanded} 
                onChange={(e, isExpanded) => setValidationExpanded(isExpanded)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Validation Rules</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {FIELD_TYPE_CONFIG[config.type]?.validations.includes('minLength') && (
                      <Grid item xs={6}>
                        <TextField
                          type="number"
                          label="Minimum Length"
                          value={config.validation?.minLength || ''}
                          onChange={(e) => updateValidation('minLength', parseInt(e.target.value) || undefined)}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                    )}
                    
                    {FIELD_TYPE_CONFIG[config.type]?.validations.includes('maxLength') && (
                      <Grid item xs={6}>
                        <TextField
                          type="number"
                          label="Maximum Length"
                          value={config.validation?.maxLength || ''}
                          onChange={(e) => updateValidation('maxLength', parseInt(e.target.value) || undefined)}
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      </Grid>
                    )}
                    {FIELD_TYPE_CONFIG[config.type]?.validations.includes('minDigits') && (
  <Grid item xs={6}>
    <TextField
      type="number"
      label="Minimum Digits"
      value={config.validation?.minDigits || ''}
      onChange={(e) => updateValidation('minDigits', parseInt(e.target.value) || undefined)}
      InputProps={{ inputProps: { min: 0 } }}
      helperText="Minimum number of digits required"
    />
  </Grid>
)}
{FIELD_TYPE_CONFIG[config.type]?.validations.includes('mAXDigits') && (
  <Grid item xs={6}>
    <TextField
      type="number"
      label="Maximum Digits"
      value={config.validation?.minDigits || ''}
      onChange={(e) => updateValidation('maxDigits', parseInt(e.target.value) || undefined)}
      InputProps={{ inputProps: { min: 0 } }}
      helperText="Maximum number of digits required"
    />
  </Grid>
)}
                    
                    {FIELD_TYPE_CONFIG[config.type]?.validations.includes('minValue') && (
                      <Grid item xs={6}>
                        <TextField
                          type="number"
                          label="Minimum Value"
                          value={config.validation?.minValue || ''}
                          onChange={(e) => updateValidation('minValue', parseInt(e.target.value) || undefined)}
                        />
                      </Grid>
                    )}
                    
                    {FIELD_TYPE_CONFIG[config.type]?.validations.includes('maxValue') && (
                      <Grid item xs={6}>
                        <TextField
                          type="number"
                          label="Maximum Value"
                          value={config.validation?.maxValue || ''}
                          onChange={(e) => updateValidation('maxValue', parseInt(e.target.value) || undefined)}
                        />
                      </Grid>
                    )}
                    
                    {FIELD_TYPE_CONFIG[config.type]?.validations.includes('email') && (
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={config.validation?.email || false}
                              onChange={(e) => updateValidation('email', e.target.checked)}
                            />
                          }
                          label="Email Format Validation"
                        />
                      </Grid>
                    )}
                    
                    {FIELD_TYPE_CONFIG[config.type]?.validations.includes('password') && (
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={config.validation?.password || false}
                              onChange={(e) => updateValidation('password', e.target.checked)}
                            />
                          }
                          label="Password Validation (8+ chars, 1 number)"
                        />
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>

            {/* Derived Field Configuration */}
            <Grid item xs={12}>
              <Accordion 
                expanded={derivedExpanded} 
                onChange={(e, isExpanded) => setDerivedExpanded(isExpanded)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Derived Field Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={config.isDerived}
                            onChange={(e) => setConfig(prev => ({ 
                              ...prev, 
                              isDerived: e.target.checked,
                              derivedConfig: e.target.checked 
                                ? { type: DERIVED_FIELD_TYPES.AGE_FROM_DOB, parentField: '' }
                                : null
                            }))}
                          />
                        }
                        label="Make this a derived field"
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Derived fields automatically calculate their value based on other fields
                      </Typography>
                    </Grid>
                    
                    {config.isDerived && (
                      <>
                        {errors.derived && (
                          <Grid item xs={12}>
                            <Alert severity="error">
                              {errors.derived}
                            </Alert>
                          </Grid>
                        )}
                        
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Derivation Type</InputLabel>
                            <Select
                              value={config.derivedConfig?.type || ''}
                              onChange={(e) => setConfig(prev => ({
                                ...prev,
                                derivedConfig: { 
                                  ...prev.derivedConfig, 
                                  type: e.target.value,
                                  parentField: '',
                                  firstNameField: '',
                                  lastNameField: ''
                                }
                              }))}
                              label="Derivation Type"
                            >
                              {Object.entries(DERIVED_FIELD_CONFIG).map(([type, derivedConfig]) => (
                                <MenuItem key={type} value={type}>
                                  {derivedConfig.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          
                          {config.derivedConfig?.type && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {DERIVED_FIELD_CONFIG[config.derivedConfig.type]?.description}
                            </Typography>
                          )}
                        </Grid>
                        
                        {config.derivedConfig?.type === DERIVED_FIELD_TYPES.AGE_FROM_DOB && (
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel>Parent Date Field</InputLabel>
                              <Select
                                value={config.derivedConfig?.parentField || ''}
                                onChange={(e) => setConfig(prev => ({
                                  ...prev,
                                  derivedConfig: { ...prev.derivedConfig, parentField: e.target.value }
                                }))}
                                label="Parent Date Field"
                              >
                                {availableParentFields.length === 0 ? (
                                  <MenuItem value="" disabled>
                                    No date fields available
                                  </MenuItem>
                                ) : (
                                  availableParentFields.map(field => (
                                    <MenuItem key={field.id} value={field.id}>
                                      {field.label}
                                    </MenuItem>
                                  ))
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                        )}
                        
                        {config.derivedConfig?.type === DERIVED_FIELD_TYPES.FULL_NAME && (
                          <>
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <InputLabel>First Name Field</InputLabel>
                                <Select
                                  value={config.derivedConfig?.firstNameField || ''}
                                  onChange={(e) => setConfig(prev => ({
                                    ...prev,
                                    derivedConfig: { ...prev.derivedConfig, firstNameField: e.target.value }
                                  }))}
                                  label="First Name Field"
                                >
                                  {availableParentFields.length === 0 ? (
                                    <MenuItem value="" disabled>
                                      No text fields available
                                    </MenuItem>
                                  ) : (
                                    availableParentFields.map(field => (
                                      <MenuItem key={field.id} value={field.id}>
                                        {field.label}
                                      </MenuItem>
                                    ))
                                  )}
                                </Select>
                              </FormControl>
                            </Grid>
                            
                            <Grid item xs={6}>
                              <FormControl fullWidth>
                                <InputLabel>Last Name Field</InputLabel>
                                <Select
                                  value={config.derivedConfig?.lastNameField || ''}
                                  onChange={(e) => setConfig(prev => ({
                                    ...prev,
                                    derivedConfig: { ...prev.derivedConfig, lastNameField: e.target.value }
                                  }))}
                                  label="Last Name Field"
                                >
                                  {availableParentFields.length === 0 ? (
                                    <MenuItem value="" disabled>
                                      No text fields available
                                    </MenuItem>
                                  ) : (
                                    availableParentFields
                                      .filter(field => field.id !== config.derivedConfig?.firstNameField)
                                      .map(field => (
                                        <MenuItem key={field.id} value={field.id}>
                                          {field.label}
                                        </MenuItem>
                                      ))
                                  )}
                                </Select>
                              </FormControl>
                            </Grid>
                          </>
                        )}
                      </>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!config.label.trim()}
        >
          {field ? 'Update Field' : 'Add Field'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FieldConfigPanel