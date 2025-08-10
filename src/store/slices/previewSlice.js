import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  formData: {},
  validationErrors: {},
  currentForm: null,
  isSubmitting: false,
  submitError: null,
}

const previewSlice = createSlice({
  name: 'preview',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      const { fieldId, value } = action.payload
      state.formData[fieldId] = value
    },
    
    setFormDataBulk: (state, action) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    
    setValidationError: (state, action) => {
      const { fieldId, error } = action.payload
      if (error) {
        state.validationErrors[fieldId] = error
      } else {
        delete state.validationErrors[fieldId]
      }
    },
    
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload
    },
    
    clearValidationErrors: (state) => {
      state.validationErrors = {}
    },
    
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload
      // Initialize form data with default values
      const initialData = {}
      if (action.payload?.fields) {
        action.payload.fields.forEach(field => {
          initialData[field.id] = field.defaultValue || (field.type === 'checkbox' ? false : '')
        })
      }
      state.formData = initialData
      state.validationErrors = {}
    },
    
    resetFormData: (state) => {
      if (state.currentForm?.fields) {
        const initialData = {}
        state.currentForm.fields.forEach(field => {
          initialData[field.id] = field.defaultValue || (field.type === 'checkbox' ? false : '')
        })
        state.formData = initialData
      } else {
        state.formData = {}
      }
      state.validationErrors = {}
    },
    
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload
    },
    
    setSubmitError: (state, action) => {
      state.submitError = action.payload
    },
    
    clearSubmitError: (state) => {
      state.submitError = null
    },
  },
})

export const {
  setFormData,
  setFormDataBulk,
  setValidationError,
  setValidationErrors,
  clearValidationErrors,
  setCurrentForm,
  resetFormData,
  setSubmitting,
  setSubmitError,
  clearSubmitError,
} = previewSlice.actions

export default previewSlice.reducer