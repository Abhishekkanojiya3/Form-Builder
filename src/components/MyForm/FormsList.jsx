import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  List as ListIcon,
} from '@mui/icons-material'
import { loadForms, deleteForm } from '../../store/slices/myFormsSlice'
import FormCard from './FormCard'

const FormsList = ({ 
  onCreateNew, 
  onPreviewForm, 
  onEditForm 
}) => {
  const dispatch = useDispatch()
  const { forms, isLoading, error } = useSelector(state => state.myForms)

  useEffect(() => {
    dispatch(loadForms())
  }, [dispatch])

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      dispatch(deleteForm(formId))
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading forms: {error}
      </Alert>
    )
  }

  if (forms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ListIcon 
          sx={{ 
            fontSize: 80, 
            color: 'text.secondary', 
            mb: 2 
          }} 
        />
        <Typography variant="h5" gutterBottom color="text.secondary">
          No Forms Created Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
          You haven't created any forms yet. Start building your first dynamic form to see it listed here.
        </Typography>
        {onCreateNew && (
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={onCreateNew}
            sx={{ minWidth: 200 }}
          >
            Create Your First Form
          </Button>
        )}
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {forms.length} Form{forms.length !== 1 ? 's' : ''} Created
        </Typography>
        {onCreateNew && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateNew}
          >
            Create New Form
          </Button>
        )}
      </Box>

      {/* Forms Grid */}
      <Grid container spacing={3}>
        {forms.map((form) => (
          <Grid item xs={12} sm={6} lg={4} key={form.id}>
            <FormCard
              form={form}
              onPreview={onPreviewForm}
              onEdit={onEditForm}
              onDelete={handleDeleteForm}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default FormsList