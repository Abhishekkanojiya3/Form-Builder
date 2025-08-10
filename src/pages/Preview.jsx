import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
} from '@mui/material'
import {
  Build as BuildIcon,
  List as ListIcon,
} from '@mui/icons-material'
import FormRenderer from '../components/FormPreview/FormRenderer'
import { setCurrentForm } from '../store/slices/previewSlice'

const Preview = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  // Get current form from formBuilder (when creating) or preview slice (when viewing saved form)
  const formBuilderState = useSelector(state => state.formBuilder)
  const previewState = useSelector(state => state.preview)
  
  // Use current form from preview slice if available, otherwise use form builder
  const currentForm = previewState.currentForm || {
    name: formBuilderState.formName || 'Untitled Form',
    fields: formBuilderState.fields
  }

  useEffect(() => {
    // Set current form in preview slice if it's from form builder
    if (!previewState.currentForm && formBuilderState.fields.length > 0) {
      dispatch(setCurrentForm({
        name: formBuilderState.formName || 'Untitled Form',
        fields: formBuilderState.fields
      }))
    }
  }, [dispatch, formBuilderState, previewState.currentForm])

  const handleFormSubmit = async (formData) => {
    // In a real application, this would send data to a backend
    console.log('Form submitted with data:', formData)
    
    // You could also save submission data to localStorage for demo purposes
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]')
    const newSubmission = {
      id: Date.now().toString(),
      formName: currentForm.name,
      submittedAt: new Date().toISOString(),
      data: formData
    }
    submissions.push(newSubmission)
    localStorage.setItem('formSubmissions', JSON.stringify(submissions))
    
    return Promise.resolve()
  }

  if (!currentForm || !currentForm.fields || currentForm.fields.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom color="text.secondary">
            No Form to Preview
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            There's no form available to preview. You can either create a new form or view an existing one from your saved forms.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<BuildIcon />}
              onClick={() => navigate('/create')}
              size="large"
            >
              Create New Form
            </Button>
            <Button
              variant="outlined"
              startIcon={<ListIcon />}
              onClick={() => navigate('/myforms')}
              size="large"
            >
              View My Forms
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Form Preview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is how your form will appear to end users. All validations and derived fields are functional.
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Preview Mode:</strong> This form is fully functional with real-time validation. 
          Derived fields will automatically update as you fill in their parent fields.
        </Typography>
      </Alert>

      {/* Form Container */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: { xs: 2, sm: 4 }, 
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <FormRenderer
          form={currentForm}
          onSubmit={handleFormSubmit}
          showSubmitButton={true}
        />
      </Paper>

      {/* Actions */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center',
        flexWrap: 'wrap',
        mt: 4 
      }}>
        <Button
          variant="outlined"
          startIcon={<BuildIcon />}
          onClick={() => navigate('/create')}
        >
          Edit Form
        </Button>
        <Button
          variant="outlined"
          startIcon={<ListIcon />}
          onClick={() => navigate('/myforms')}
        >
          View All Forms
        </Button>
      </Box>
    </Container>
  )
}

export default Preview