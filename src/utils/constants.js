export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  DATE: 'date',
}

export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  EMAIL: 'email',
  PASSWORD: 'password',
  MIN_VALUE: 'minValue',
  MAX_VALUE: 'maxValue',
}

export const FIELD_TYPE_CONFIG = {
  [FIELD_TYPES.TEXT]: {
    label: 'Text Input',
    icon: 'TextFields',
    validations: [
      VALIDATION_TYPES.REQUIRED, 
      VALIDATION_TYPES.MIN_LENGTH, 
      VALIDATION_TYPES.MAX_LENGTH, 
      VALIDATION_TYPES.EMAIL,
      VALIDATION_TYPES.PASSWORD
    ],
    defaultProps: {
      placeholder: 'Enter text...',
    },
  },
  [FIELD_TYPES.NUMBER]: {
    label: 'Number Input',
    icon: 'Numbers',
    validations: [
      VALIDATION_TYPES.REQUIRED, 
      VALIDATION_TYPES.MIN_VALUE, 
      VALIDATION_TYPES.MAX_VALUE,
      VALIDATION_TYPES.MIN_DIGITS, 
      VALIDATION_TYPES.MAX_DIGITS, 

    ],
    defaultProps: {
      placeholder: 'Enter number...',
    },
  },
  [FIELD_TYPES.TEXTAREA]: {
    label: 'Text Area',
    icon: 'Notes',
    validations: [
      VALIDATION_TYPES.REQUIRED, 
      VALIDATION_TYPES.MIN_LENGTH, 
      VALIDATION_TYPES.MAX_LENGTH
    ],
    defaultProps: {
      placeholder: 'Enter text...',
      rows: 4,
    },
  },
  [FIELD_TYPES.SELECT]: {
    label: 'Select Dropdown',
    icon: 'ArrowDropDown',
    validations: [VALIDATION_TYPES.REQUIRED],
    defaultProps: {
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
    },
  },
  [FIELD_TYPES.RADIO]: {
    label: 'Radio Buttons',
    icon: 'RadioButtonChecked',
    validations: [VALIDATION_TYPES.REQUIRED],
    defaultProps: {
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
    },
  },
  [FIELD_TYPES.CHECKBOX]: {
    label: 'Checkbox',
    icon: 'CheckBox',
    validations: [],
    defaultProps: {
      defaultValue: false,
    },
  },
  [FIELD_TYPES.DATE]: {
    label: 'Date Picker',
    icon: 'DateRange',
    validations: [VALIDATION_TYPES.REQUIRED],
    defaultProps: {
      placeholder: 'Select date...',
    },
  },
}

export const DERIVED_FIELD_TYPES = {
  AGE_FROM_DOB: 'age_from_dob',
  FULL_NAME: 'full_name',
  CALCULATED_FIELD: 'calculated_field',
}

export const DERIVED_FIELD_CONFIG = {
  [DERIVED_FIELD_TYPES.AGE_FROM_DOB]: {
    label: 'Age from Date of Birth',
    description: 'Automatically calculate age based on date of birth',
    parentFieldTypes: [FIELD_TYPES.DATE],
  },
  [DERIVED_FIELD_TYPES.FULL_NAME]: {
    label: 'Full Name from First and Last Name',
    description: 'Combine first name and last name fields',
    parentFieldTypes: [FIELD_TYPES.TEXT],
  },
}

export const VALIDATION_MESSAGES = {
  REQUIRED: (fieldLabel) => `${fieldLabel} is required`,
  MIN_LENGTH: (fieldLabel, minLength) => `${fieldLabel} must be at least ${minLength} characters`,
  MAX_LENGTH: (fieldLabel, maxLength) => `${fieldLabel} must be no more than ${maxLength} characters`,
  EMAIL: () => 'Please enter a valid email address',
  PASSWORD: () => 'Password must be at least 8 characters and contain at least one number',
  MIN_VALUE: (fieldLabel, minValue) => `${fieldLabel} must be at least ${minValue}`,
  MAX_VALUE: (fieldLabel, maxValue) => `${fieldLabel} must be no more than ${maxValue}`,
}

export const FORM_BUILDER_CONFIG = {
  MAX_FIELDS: 50,
  MIN_FORM_NAME_LENGTH: 1,
  MAX_FORM_NAME_LENGTH: 100,
  DEFAULT_FIELD_LABEL_PREFIX: 'Field',
}