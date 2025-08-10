import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
} from '@mui/material'
import FormsList from '../components/MyForm/FormsList'
import { loadFormForEditing } from '../store/slices/formBuilderSlice'
import { setCurrentForm } from '../store/slices/previewSlice'

const MyForms = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleCreateNew = () => {
    navigate('/create')
  }

  const handlePreviewForm = (form) => {
    // Set the form in preview slice and navigate to preview
    dispatch(setCurrentForm(form))
    navigate('/preview')
  }

  const handleEditForm = (form) => {
    // Load form into form builder and navigate to create page
    dispatch(loadFormForEditing(form))
    navigate('/create')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Forms
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all your created forms. You can preview, edit, or delete any form from here.
        </Typography>
      </Box>

      {/* Forms List */}
      <FormsList
        onCreateNew={handleCreateNew}
        onPreviewForm={handlePreviewForm}
        onEditForm={handleEditForm}
      />
    </Container>
  )
}

export default MyForms