import { VALIDATION_MESSAGES } from './constants'

export const validateField = (value, field) => {
  const errors = []
  const { validation, required, label } = field

  // Required validation - check first
  if (required && (!value || value.toString().trim() === '')) {
    errors.push(VALIDATION_MESSAGES.REQUIRED(label))
    return errors // Return early if required field is empty
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return errors
  }

  // Email validation
  if (validation?.email && field.type === 'text') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      errors.push(VALIDATION_MESSAGES.EMAIL())
    }
  }

  // Password validation
  if (validation?.password && field.type === 'text') {
    if (value.length < 8 || !/\d/.test(value)) {
      errors.push(VALIDATION_MESSAGES.PASSWORD())
    }
  }

  // Length validations (for text fields)
  if (validation?.minLength && value.toString().length < validation.minLength) {
    errors.push(VALIDATION_MESSAGES.MIN_LENGTH(label, validation.minLength))
  }
  
  if (validation?.maxLength && value.toString().length > validation.maxLength) {
    errors.push(VALIDATION_MESSAGES.MAX_LENGTH(label, validation.maxLength))
  }

  // Number validations (for numeric values)
  if (field.type === 'number') {
    const numValue = parseFloat(value)
    
    if (isNaN(numValue)) {
      errors.push(`${label} must be a valid number`)
    } else {
      if (validation?.minValue !== undefined && numValue < validation.minValue) {
        errors.push(VALIDATION_MESSAGES.MIN_VALUE(label, validation.minValue))
      }
      if (validation?.maxValue !== undefined && numValue > validation.maxValue) {
        errors.push(VALIDATION_MESSAGES.MAX_VALUE(label, validation.maxValue))
      }
    }
  }

  // Digit count validations (if you want to validate number of digits)
  if (validation?.minDigits || validation?.maxDigits) {
    const digitCount = value.toString().replace(/[^0-9]/g, '').length
    
    if (validation?.minDigits && digitCount < validation.minDigits) {
      errors.push(`${label} must contain at least ${validation.minDigits} digits`)
    }
    
    if (validation?.maxDigits && digitCount > validation.maxDigits) {
      errors.push(`${label} must contain no more than ${validation.maxDigits} digits`)
    }
  }

  return errors
}

export const validateForm = (formData, fields) => {
  const errors = {}
  
  fields.forEach(field => {
    if (!field.isDerived) {
      const fieldErrors = validateField(formData[field.id], field)
      if (fieldErrors.length > 0) {
        errors[field.id] = fieldErrors[0] // Take first error
      }
    }
  })
  
  return errors
}

export const hasValidationErrors = (errors) => {
  return Object.keys(errors).length > 0
}

export const getFieldError = (fieldId, errors) => {
  return errors[fieldId] || null
}

// Validate individual validation rules
export const validateRule = (rule, value, ruleValue) => {
  switch (rule) {
    case 'minLength':
      return !value || value.toString().length >= ruleValue
    case 'maxLength':
      return !value || value.toString().length <= ruleValue
    case 'minValue':
      return !value || parseFloat(value) >= ruleValue
    case 'maxValue':
      return !value || parseFloat(value) <= ruleValue
    case 'minDigits':{
      if (!value) return true
      const minDigitCount = value.toString().replace(/[^0-9]/g, '').length
      return minDigitCount >= ruleValue
    }
    case 'maxDigits':{
      if (!value) return true
      const maxDigitCount = value.toString().replace(/[^0-9]/g, '').length
      return maxDigitCount <= ruleValue
    }
    case 'email': {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    }
    case 'password':
      if (!value) return true
      return value.length >= 8 && /\d/.test(value)
    default:
      return true
  }
}

// Form name validation
export const validateFormName = (name) => {
  const errors = []
  
  if (!name || name.trim() === '') {
    errors.push('Form name is required')
    return errors
  }
  
  if (name.length < 1) {
    errors.push('Form name must be at least 1 character')
  }
  
  if (name.length > 100) {
    errors.push('Form name must be no more than 100 characters')
  }
  
  return errors
}