import { createSlice } from '@reduxjs/toolkit'
import { saveForm as saveFormToStorage } from '../utils/localStorage'

const initialState = {
  fields: [],
  formName: '',
  currentEditingField: null,
  draggedFieldId: null,
  isLoading: false,
  error: null,
}

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action) => {
      const newField = {
        id: Date.now().toString(),
        type: action.payload.type,
        label: `${action.payload.type} Field`,
        required: false,
        defaultValue: '',
        validation: {},
        isDerived: false,
        derivedConfig: null,
        options: [],
        ...action.payload,
      }
      state.fields.push(newField)
    },
    
    updateField: (state, action) => {
      const { id, updates } = action.payload
      const fieldIndex = state.fields.findIndex(field => field.id === id)
      if (fieldIndex !== -1) {
        state.fields[fieldIndex] = { ...state.fields[fieldIndex], ...updates }
      }
    },
    
    deleteField: (state, action) => {
      state.fields = state.fields.filter(field => field.id !== action.payload)
    },
    
    reorderFields: (state, action) => {
      const { dragIndex, dropIndex } = action.payload
      const draggedField = state.fields[dragIndex]
      state.fields.splice(dragIndex, 1)
      state.fields.splice(dropIndex, 0, draggedField)
    },
    
    moveFieldUp: (state, action) => {
      const fieldId = action.payload
      const fieldIndex = state.fields.findIndex(field => field.id === fieldId)
      if (fieldIndex > 0) {
        const field = state.fields[fieldIndex]
        state.fields.splice(fieldIndex, 1)
        state.fields.splice(fieldIndex - 1, 0, field)
      }
    },
    
    moveFieldDown: (state, action) => {
      const fieldId = action.payload
      const fieldIndex = state.fields.findIndex(field => field.id === fieldId)
      if (fieldIndex < state.fields.length - 1) {
        const field = state.fields[fieldIndex]
        state.fields.splice(fieldIndex, 1)
        state.fields.splice(fieldIndex + 1, 0, field)
      }
    },
    
    setCurrentEditingField: (state, action) => {
      state.currentEditingField = action.payload
    },
    
    setFormName: (state, action) => {
      state.formName = action.payload
    },
    
    saveForm: (state) => {
      if (state.formName && state.fields.length > 0) {
        try {
          state.isLoading = true
          const formSchema = {
            name: state.formName,
            fields: state.fields,
          }
          saveFormToStorage(formSchema)
          
          // Reset form builder
          state.fields = []
          state.formName = ''
          state.currentEditingField = null
          state.error = null
        } catch (error) {
          state.error = error.message
        } finally {
          state.isLoading = false
        }
      }
    },
    
    loadFormForEditing: (state, action) => {
      const form = action.payload
      state.fields = form.fields || []
      state.formName = form.name || ''
    },
    
    clearForm: (state) => {
      state.fields = []
      state.formName = ''
      state.currentEditingField = null
      state.error = null
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
  addField,
  updateField,
  deleteField,
  reorderFields,
  moveFieldUp,
  moveFieldDown,
  setCurrentEditingField,
  setFormName,
  saveForm,
  loadFormForEditing,
  clearForm,
  setError,
  clearError,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer