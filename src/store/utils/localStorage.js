// Utility functions for localStorage operations
export const loadFromStorage = (key) => {
  try {
    const serializedData = localStorage.getItem(key)
    if (serializedData === null) return undefined
    return JSON.parse(serializedData)
  } catch (err) {
    console.error('Error loading from localStorage:', err)
    return undefined
  }
}

export const saveToStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(key, serializedData)
  } catch (err) {
    console.error('Error saving to localStorage:', err)
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error('Error removing from localStorage:', err)
  }
}

export const getAllForms = () => {
  return loadFromStorage('forms') || []
}

export const saveForm = (formData) => {
  const forms = getAllForms()
  const newForm = {
    ...formData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  forms.push(newForm)
  saveToStorage('forms', forms)
  return newForm
}

export const updateForm = (formId, formData) => {
  const forms = getAllForms()
  const formIndex = forms.findIndex(form => form.id === formId)
  
  if (formIndex !== -1) {
    forms[formIndex] = {
      ...forms[formIndex],
      ...formData,
      updatedAt: new Date().toISOString(),
    }
    saveToStorage('forms', forms)
    return forms[formIndex]
  }
  
  return null
}

export const deleteForm = (formId) => {
  const forms = getAllForms()
  const filteredForms = forms.filter(form => form.id !== formId)
  saveToStorage('forms', filteredForms)
}

export const getFormById = (formId) => {
  const forms = getAllForms()
  return forms.find(form => form.id === formId)
}