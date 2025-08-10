import { DERIVED_FIELD_TYPES } from './constants'

export const calculateDerivedValue = (field, formData) => {
  if (!field.isDerived || !field.derivedConfig) {
    return ''
  }

  try {
    switch (field.derivedConfig.type) {
      case DERIVED_FIELD_TYPES.AGE_FROM_DOB:
        return calculateAgeFromDOB(field.derivedConfig, formData)
      
      case DERIVED_FIELD_TYPES.FULL_NAME:
        return calculateFullName(field.derivedConfig, formData)
      
      default:
        console.warn(`Unknown derived field type: ${field.derivedConfig.type}`)
        return ''
    }
  } catch (error) {
    console.error('Error calculating derived value:', error)
    return ''
  }
}

const calculateAgeFromDOB = (config, formData) => {
  const dobValue = formData[config.parentField]
  
  if (!dobValue) {
    return ''
  }

  try {
    const today = new Date()
    const birthDate = new Date(dobValue)
    
    // Check if the birth date is valid
    if (isNaN(birthDate.getTime())) {
      return ''
    }
    
    // Check if birth date is in the future
    if (birthDate > today) {
      return ''
    }
    
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age >= 0 ? age.toString() : ''
  } catch (error) {
    console.error('Error calculating age from DOB:', error)
    return ''
  }
}

const calculateFullName = (config, formData) => {
  const firstNameValue = formData[config.firstNameField] || ''
  const lastNameValue = formData[config.lastNameField] || ''
  
  const fullName = `${firstNameValue} ${lastNameValue}`.trim()
  return fullName
}

// Update all derived fields in form data
export const updateDerivedFields = (formData, fields) => {
  const updatedData = { ...formData }
  let hasChanges = false
  
  fields.forEach(field => {
    if (field.isDerived) {
      const newValue = calculateDerivedValue(field, formData, fields)
      if (updatedData[field.id] !== newValue) {
        updatedData[field.id] = newValue
        hasChanges = true
      }
    }
  })
  
  return { data: updatedData, hasChanges }
}

// Get available parent fields for a derived field type
export const getAvailableParentFields = (derivedType, allFields, currentFieldId = null) => {
  const availableFields = allFields.filter(field => {
    // Don't include the current field itself
    if (currentFieldId && field.id === currentFieldId) {
      return false
    }
    
    // Don't include other derived fields
    if (field.isDerived) {
      return false
    }
    
    // Filter by field type based on derived type
    switch (derivedType) {
      case DERIVED_FIELD_TYPES.AGE_FROM_DOB:
        return field.type === 'date'
      
      case DERIVED_FIELD_TYPES.FULL_NAME:
        return field.type === 'text'
      
      default:
        return false
    }
  })
  
  return availableFields
}

// Validate derived field configuration
export const validateDerivedFieldConfig = (derivedConfig, allFields= null) => {
  const errors = []
  
  if (!derivedConfig || !derivedConfig.type) {
    errors.push('Derived field type is required')
    return errors
  }
  
  switch (derivedConfig.type) {
    case DERIVED_FIELD_TYPES.AGE_FROM_DOB:
      if (!derivedConfig.parentField) {
        errors.push('Parent date field is required for age calculation')
      } else {
        const parentField = allFields.find(f => f.id === derivedConfig.parentField)
        if (!parentField) {
          errors.push('Selected parent field not found')
        } else if (parentField.type !== 'date') {
          errors.push('Parent field must be a date field')
        }
      }
      break
    
    case DERIVED_FIELD_TYPES.FULL_NAME:
      if (!derivedConfig.firstNameField || !derivedConfig.lastNameField) {
        errors.push('Both first name and last name fields are required')
      } else {
        const firstNameField = allFields.find(f => f.id === derivedConfig.firstNameField)
        const lastNameField = allFields.find(f => f.id === derivedConfig.lastNameField)
        
        if (!firstNameField || !lastNameField) {
          errors.push('Selected parent fields not found')
        } else if (firstNameField.type !== 'text' || lastNameField.type !== 'text') {
          errors.push('Parent fields must be text fields')
        }
      }
      break
    
    default:
      errors.push(`Unknown derived field type: ${derivedConfig.type}`)
  }
  
  return errors
}