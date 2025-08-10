import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Save as SaveIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'
import FieldTypeSelector from '../components/Formbuilder/FieldTypeSelector'
import FieldList from '../components/Formbuilder/FieldsList'
import FieldConfigPanel from '../components/Formbuilder/FieldConfigPanel'
import {
  addField,
  updateField,
  deleteField,
  moveFieldUp,
  moveFieldDown,
  setCurrentEditingField,
  setFormName,
  saveForm,
  clearForm,
} from '../store/slices/formBuilderSlice'
import { FORM_BUILDER_CONFIG } from '../utils/constants'

const Create = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { fields, currentEditingField, isLoading, error } = useSelector(
    state => state.formBuilder
  )
  
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [tempFormName, setTempFormName] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleAddField = (fieldType) => {
    const newField = {
      type: fieldType,
      label: `${fieldType} Field ${fields.length + 1}`,
      required: false,
      defaultValue: fieldType === 'checkbox' ? false : '',
      validation: {},
      isDerived: false,
      derivedConfig: null,
      options: ['select', 'radio'].includes(fieldType) 
        ? [{ label: 'Option 1', value: 'option1' }] 
        : []
    }
    
    dispatch(setCurrentEditingField(newField))
    setConfigModalOpen(true)
  }

  const handleEditField = (field) => {
    dispatch(setCurrentEditingField(field))
    setConfigModalOpen(true)
  }

  const handleSaveField = (fieldConfig) => {
    if (currentEditingField && fields.find(f => f.id === currentEditingField.id)) {
      // Update existing field
      dispatch(updateField({ id: currentEditingField.id, updates: fieldConfig }))
      showSnackbar('Field updated successfully', 'success')
    } else {
      // Add new field
      dispatch(addField(fieldConfig))
      showSnackbar('Field added successfully', 'success')
    }
    
    dispatch(setCurrentEditingField(null))
    setConfigModalOpen(false)
  }

  const handleDeleteField = (fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteField(fieldId))
      showSnackbar('Field deleted successfully', 'success')
    }
  }

  const handleMoveField = (fieldId, direction) => {
    if (direction === 'up') {
      dispatch(moveFieldUp(fieldId))
    } else {
      dispatch(moveFieldDown(fieldId))
    }
  }

  const handleSaveForm = () => {
    if (!tempFormName.trim()) {
      showSnackbar('Please enter a form name', 'error')
      return
    }
    
    if (fields.length === 0) {
      showSnackbar('Please add at least one field to save the form', 'error')
      return
    }

    dispatch(setFormName(tempFormName))
    dispatch(saveForm())
    
    setSaveDialogOpen(false)
    setTempFormName('')
    showSnackbar('Form saved successfully!', 'success')
    
    // Navigate to My Forms after save
    setTimeout(() => {
      navigate('/myforms')
    }, 1500)
  }

  const handleClearForm = () => {
    if (window.confirm('Are you sure you want to clear the entire form? This action cannot be undone.')) {
      dispatch(clearForm())
      showSnackbar('Form cleared successfully', 'info')
    }
  }

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const isMaxFieldsReached = fields.length >= FORM_BUILDER_CONFIG.MAX_FIELDS

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Form
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Build dynamic forms by adding and configuring fields. Your form will be automatically saved to localStorage.
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Field Type Selector */}
      <FieldTypeSelector 
        onAddField={handleAddField}
        disabled={isMaxFieldsReached}
      />

      {/* Field List */}
      <FieldList
        fields={fields}
        onEditField={handleEditField}
        onDeleteField={handleDeleteField}
        onMoveField={handleMoveField}
      />

      {/* Action Buttons */}
      {fields.length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center',
          flexWrap: 'wrap',
          mt: 4 
        }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearForm}
            color="error"
          >
            Clear Form
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={() => setSaveDialogOpen(true)}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Form'}
          </Button>
        </Box>
      )}

      {/* Field Configuration Modal */}
      <FieldConfigPanel
        open={configModalOpen}
        onClose={() => {
          setConfigModalOpen(false)
          dispatch(setCurrentEditingField(null))
        }}
        field={currentEditingField}
        onSave={handleSaveField}
        allFields={fields}
      />

      {/* Save Form Dialog */}
      <Dialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a name for your form. You'll be able to find and edit it later in "My Forms".
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Form Name"
            value={tempFormName}
            onChange={(e) => setTempFormName(e.target.value)}
            error={!tempFormName.trim()}
            helperText={!tempFormName.trim() ? 'Form name is required' : ''}
            inputProps={{
              maxLength: FORM_BUILDER_CONFIG.MAX_FORM_NAME_LENGTH
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {fields.length} field{fields.length !== 1 ? 's' : ''} will be saved
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveForm} 
            variant="contained"
            disabled={!tempFormName.trim() || isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Form'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Create