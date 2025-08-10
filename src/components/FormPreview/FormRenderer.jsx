import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
} from '@mui/material'
import FieldRenderer from './FieldRenderer'
import { validateForm } from '../../utils/validation'
import { updateDerivedFields } from '../../utils/derivedFields'
import { 
  setFormData, 
  setValidationErrors, 
  clearValidationErrors,
  setSubmitting 
} from '../../store/slices/previewSlice'

const FormRenderer = ({ 
  form, 
  onSubmit,
  showSubmitButton = true,
  title
}) => {
  const dispatch = useDispatch()
  const { formData, validationErrors, isSubmitting } = useSelector(state => state.preview)
  
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitSeverity, setSubmitSeverity] = useState('success')

  // Initialize form data when form changes
  useEffect(() => {
    if (form?.fields) {
      const initialData = {}
      form.fields.forEach(field => {
        if (field.isDerived) {
          initialData[field.id] = ''
        } else {
          initialData[field.id] = field.defaultValue || (field.type === 'checkbox' ? false : '')
        }
      })
      
      // Update derived fields
      const { data: updatedData } = updateDerivedFields(initialData, form.fields)
      
      // Set initial form data
      Object.entries(updatedData).forEach(([fieldId, value]) => {
        dispatch(setFormData({ fieldId, value }))
      })
    }
  }, [form, dispatch])

  // Update derived fields when form data changes
  useEffect(() => {
    if (form?.fields && Object.keys(formData).length > 0) {
      const { data: updatedData, hasChanges } = updateDerivedFields(formData, form.fields)
      
      if (hasChanges) {
        Object.entries(updatedData).forEach(([fieldId, value]) => {
          if (formData[fieldId] !== value) {
            dispatch(setFormData({ fieldId, value }))
          }
        })
      }
    }
  }, [formData, form, dispatch])

  const handleFieldChange = (fieldId, value) => {
    dispatch(setFormData({ fieldId, value }))
    
    // Clear validation error for this field
    if (validationErrors[fieldId]) {
      const newErrors = { ...validationErrors }
      delete newErrors[fieldId]
      dispatch(setValidationErrors(newErrors))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!form || !form.fields) {
      return
    }

    dispatch(setSubmitting(true))
    setSubmitMessage('')
    
    try {
      // Validate form
      const errors = validateForm(formData, form.fields)
      
      if (Object.keys(errors).length > 0) {
        dispatch(setValidationErrors(errors))
        setSubmitMessage('Please fix the validation errors below')
        setSubmitSeverity('error')
        return
      }

      // Clear any existing errors
      dispatch(clearValidationErrors())
      
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSubmit) {
        await onSubmit(formData)
      }
      
      setSubmitMessage('Form submitted successfully!')
      setSubmitSeverity('success')
      
    } catch (error) {
      setSubmitMessage(error.message || 'An error occurred while submitting the form')
      setSubmitSeverity('error')
    } finally {
      dispatch(setSubmitting(false))
    }
  }

  if (!form || !form.fields || form.fields.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No form to display
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please create a form first
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Typography variant="h5" gutterBottom>
        {form.name || 'Untitled Form'}
      </Typography>
      
      {submitMessage && (
        <Alert 
          severity={submitSeverity} 
          sx={{ mb: 3 }}
          onClose={() => setSubmitMessage('')}
        >
          {submitMessage}
        </Alert>
      )}
      
      {isSubmitting && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Submitting form...
          </Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {form.fields.map((field) => (
          <Box key={field.id} sx={{ mb: 3 }}>
            <FieldRenderer
              field={field}
              value={formData[field.id]}
              onChange={handleFieldChange}
              error={validationErrors[field.id]}
            />
          </Box>
        ))}
        
        {showSubmitButton && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ minWidth: 200 }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default FormRenderer