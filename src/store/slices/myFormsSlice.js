import { createSlice } from '@reduxjs/toolkit'
import { getAllForms, deleteForm as deleteFormFromStorage } from '../utils/localStorage'

const initialState = {
  forms: [],
  isLoading: false,
  error: null,
  selectedFormId: null,
}

const myFormsSlice = createSlice({
  name: 'myForms',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    
    setForms: (state, action) => {
      state.forms = action.payload
    },
    
    addForm: (state, action) => {
      state.forms.push(action.payload)
    },
    
    updateForm: (state, action) => {
      const { id, updates } = action.payload
      const formIndex = state.forms.findIndex(form => form.id === id)
      if (formIndex !== -1) {
        state.forms[formIndex] = { ...state.forms[formIndex], ...updates }
      }
    },
    
    deleteForm: (state, action) => {
      const formId = action.payload
      try {
        deleteFormFromStorage(formId)
        state.forms = state.forms.filter(form => form.id !== formId)
        if (state.selectedFormId === formId) {
          state.selectedFormId = null
        }
      } catch (error) {
        state.error = error.message
      }
    },
    
    loadForms: (state) => {
      try {
        state.isLoading = true
        state.forms = getAllForms()
        state.error = null
      } catch (error) {
        state.error = error.message
      } finally {
        state.isLoading = false
      }
    },
    
    setSelectedForm: (state, action) => {
      state.selectedFormId = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
    },
    
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setLoading,
  setForms,
  addForm,
  updateForm,
  deleteForm,
  loadForms,
  setSelectedForm,
  setError,
  clearError,
} = myFormsSlice.actions

export default myFormsSlice.reducer